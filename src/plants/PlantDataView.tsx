import { useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { PlantType } from '../interface';
import SimpleInlineField from '../components/inline-fields/SimpleInlineField';
import CollapsableSimpleInlineField from '../components/inline-fields/CollapsableSimpleInlineField';
import { usePlantData } from '../hooks/useStaticData';

interface PlantDataViewProps {
  type?: PlantType | null;
}

const TextBox = styled(Box)({
  display: 'flex',
  minHeight: 32
});

const PlantDataView = ({ type }: PlantDataViewProps) => {
  const plantData = usePlantData();

  const data = useMemo(() => {
    if (type && plantData && type in plantData) {
      return plantData[type];
    }

    return undefined;
  }, [plantData, type]);

  if (!data) {
    return null;
  }

  return (
    <>
      {data.howToGrow.spring?.indoor || data.howToGrow.fall?.indoor ? (
        <SimpleInlineField
          label="From Seed Indoors"
          value={
            <Box sx={{ display: 'block' }}>
              {data.howToGrow.spring?.indoor ? (
                <>
                  <TextBox>
                    <strong>Start</strong>: {data.howToGrow.spring.indoor.min} - {data.howToGrow.spring.indoor.max}
                  </TextBox>
                  {data.howToGrow.spring.indoor.transplant_min ? (
                    <TextBox>
                      <strong>Transplant</strong>: {data.howToGrow.spring.indoor.transplant_min} -{' '}
                      {data.howToGrow.spring.indoor.transplant_max}
                    </TextBox>
                  ) : null}
                </>
              ) : null}
              {data.howToGrow.fall?.indoor ? (
                <>
                  <TextBox>
                    <strong>Fall Start</strong>: {data.howToGrow.fall.indoor.min} - {data.howToGrow.fall.indoor.max}
                  </TextBox>
                  {data.howToGrow.fall.indoor.transplant_min ? (
                    <TextBox>
                      <strong>Transplant</strong>: {data.howToGrow.fall.indoor.transplant_min} -{' '}
                      {data.howToGrow.fall.indoor.transplant_max}
                    </TextBox>
                  ) : null}
                </>
              ) : null}
            </Box>
          }
        />
      ) : null}
      {data.howToGrow.spring?.outdoor || data.howToGrow.fall?.outdoor ? (
        <SimpleInlineField
          label="From Seed Outdoors"
          value={
            <Box sx={{ display: 'block' }}>
              {data.howToGrow.spring?.outdoor ? (
                <TextBox>
                  <strong>Start</strong>: {data.howToGrow.spring.outdoor.min} - {data.howToGrow.spring.outdoor.max}
                </TextBox>
              ) : null}
              {data.howToGrow.fall?.outdoor ? (
                <TextBox>
                  <strong>Fall Start</strong>: {data.howToGrow.fall.outdoor.min} - {data.howToGrow.fall.outdoor.max}
                </TextBox>
              ) : null}
            </Box>
          }
        />
      ) : null}
      {data.howToGrow.spring?.plant || data.howToGrow.fall?.plant ? (
        <SimpleInlineField
          label="From Plant"
          value={
            <Box sx={{ display: 'block' }}>
              {data.howToGrow.spring?.plant ? (
                <TextBox>
                  <strong>Start</strong>: {data.howToGrow.spring.plant.min} - {data.howToGrow.spring.plant.max}
                </TextBox>
              ) : null}
              {data.howToGrow.fall?.plant ? (
                <TextBox>
                  <strong>Fall Start</strong>: {data.howToGrow.fall.plant.min} - {data.howToGrow.fall.plant.max}
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
          value={<div dangerouslySetInnerHTML={{ __html: section[1] }} />}
          startCollapsed
        />
      ))}
    </>
  );
};

export default PlantDataView;
