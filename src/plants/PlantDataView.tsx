import { ReactNode, useMemo } from 'react';
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
  minHeight: 40
});

function renderHtmlNode(node: ChildNode, key: string): ReactNode | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const element = node as HTMLElement;
  const children = Array.from(element.childNodes)
    .map((childNode, index) => renderHtmlNode(childNode, `${key}-${index}`))
    .filter((childNode): childNode is ReactNode => childNode !== null);

  switch (element.tagName.toLowerCase()) {
    case 'p':
      return (
        <Box key={key} component="p" sx={{ m: 0, mb: 1.5 }}>
          {children}
        </Box>
      );
    case 'ul':
      return (
        <Box key={key} component="ul" sx={{ m: 0, pl: 3 }}>
          {children}
        </Box>
      );
    case 'ol':
      return (
        <Box key={key} component="ol" sx={{ m: 0, pl: 3 }}>
          {children}
        </Box>
      );
    case 'li':
      return (
        <Box key={key} component="li" sx={{ mb: 0.5 }}>
          {children}
        </Box>
      );
    case 'strong':
      return <strong key={key}>{children}</strong>;
    case 'em':
      return <em key={key}>{children}</em>;
    case 'br':
      return <br key={key} />;
    case 'a': {
      const href = element.getAttribute('href');
      const safeHref = href && /^(https?:|mailto:|\/)/i.test(href) ? href : undefined;

      return (
        <Box
          key={key}
          component="a"
          href={safeHref}
          target={safeHref?.startsWith('/') ? undefined : '_blank'}
          rel={safeHref?.startsWith('/') ? undefined : 'noreferrer'}
        >
          {children}
        </Box>
      );
    }
    default:
      return (
        <Box key={key} component="span">
          {children}
        </Box>
      );
  }
}

function HtmlContent({ html }: { html: string }) {
  const content = useMemo(() => {
    const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
    return Array.from(parsedDocument.body.childNodes)
      .map((node, index) => renderHtmlNode(node, `plant-data-${index}`))
      .filter((node): node is ReactNode => node !== null);
  }, [html]);

  return <Box sx={{ display: 'block' }}>{content}</Box>;
}

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
          value={<HtmlContent html={section[1]} />}
          startCollapsed
        />
      ))}
    </>
  );
};

export default PlantDataView;
