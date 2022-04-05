/* eslint-disable react/no-array-index-key */
import { useEffect, useState } from 'react';
import { Box, styled } from '@mui/material';
import { PlantData, PlantType } from '../interface';
import SimpleInlineField from '../components/inline-fields/SimpleInlineField';
import CollapsableSimpleInlineField from '../components/inline-fields/CollapsableSimpleInlineField';
import plantData from '../data/plantData';

interface PlantDataViewProps {
  type?: PlantType;
}

const TextBox = styled(Box)({
  display: 'flex',
  minHeight: 32
});

const PlantDataView = ({ type }: PlantDataViewProps) => {
  const [data, setData] = useState<PlantData | null>(null);

  useEffect(() => {
    if (type && type in plantData) {
      setData(plantData[type]);
    }
  }, [type]);

  if (!data) {
    return null;
  }

  return (
    <>
      {data.howToGrow.indoor?.indoor_min || data.howToGrow.indoor?.fall_indoor_min ? (
        <SimpleInlineField
          label="From Seed Indoors"
          value={
            <Box sx={{ display: 'block' }}>
              {data.howToGrow.indoor.indoor_min ? (
                <>
                  <TextBox>
                    <strong>Start</strong>: {data.howToGrow.indoor.indoor_min} - {data.howToGrow.indoor.indoor_max}
                  </TextBox>
                  {data.howToGrow.indoor.transplant_min ? (
                    <TextBox>
                      <strong>Transplant</strong>: {data.howToGrow.indoor.transplant_min} -{' '}
                      {data.howToGrow.indoor.transplant_max}
                    </TextBox>
                  ) : null}
                </>
              ) : null}
              {data.howToGrow.indoor.fall_indoor_min ? (
                <>
                  <TextBox>
                    <strong>Fall Start</strong>: {data.howToGrow.indoor.fall_indoor_min} -{' '}
                    {data.howToGrow.indoor.fall_indoor_max}
                  </TextBox>
                  {data.howToGrow.indoor.fall_transplant_min ? (
                    <TextBox>
                      <strong>Transplant</strong>: {data.howToGrow.indoor.fall_transplant_min} -{' '}
                      {data.howToGrow.indoor.fall_transplant_max}
                    </TextBox>
                  ) : null}
                </>
              ) : null}
            </Box>
          }
        />
      ) : null}
      {data.howToGrow.outdoor?.direct_min || data.howToGrow.outdoor?.fall_direct_min ? (
        <SimpleInlineField
          label="From Seed Outdoors"
          value={
            <Box sx={{ display: 'block' }}>
              {data.howToGrow.outdoor.direct_min ? (
                <TextBox>
                  <strong>Start</strong>: {data.howToGrow.outdoor.direct_min} - {data.howToGrow.outdoor.direct_max}
                </TextBox>
              ) : null}
              {data.howToGrow.outdoor.fall_direct_min ? (
                <TextBox>
                  <strong>Fall Start</strong>: {data.howToGrow.outdoor.fall_direct_min} -{' '}
                  {data.howToGrow.outdoor.fall_direct_max}
                </TextBox>
              ) : null}
            </Box>
          }
        />
      ) : null}
      {data.howToGrow.plant?.transplant_min || data.howToGrow.plant?.transplant_max ? (
        <SimpleInlineField
          label="From Plant"
          value={
            <Box sx={{ display: 'block' }}>
              {data.howToGrow.plant.transplant_min ? (
                <TextBox>
                  <strong>Start</strong>: {data.howToGrow.plant.transplant_min} - {data.howToGrow.plant.transplant_max}
                </TextBox>
              ) : null}
              {data.howToGrow.plant.fall_transplant_min ? (
                <TextBox>
                  <strong>Fall Start</strong>: {data.howToGrow.plant.fall_transplant_min} -{' '}
                  {data.howToGrow.plant.fall_transplant_max}
                </TextBox>
              ) : null}
            </Box>
          }
        />
      ) : null}
      {data.faq.how_to_grow?.map((section) => (
        <CollapsableSimpleInlineField
          key={`section-${section[0]}`}
          label={section[0]}
          // eslint-disable-next-line react/no-danger
          value={<div dangerouslySetInnerHTML={{ __html: section[1] }} />}
          startCollapsed
        />
      ))}
    </>
  );
};

export default PlantDataView;
