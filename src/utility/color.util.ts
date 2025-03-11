const BACKGROUND_COLORS = [
  '#DCB726',
  '#271AD0',
  '#06751F',
  '#AA9EFA',
  '#05D455',
  '#D617B1',
  '#906C08',
  '#17C7C5',
  '#B13462',
  '#D2583F',
  '#29213A',
  '#3D5AB0',
  '#7B9D32',
  '#B3B6F2',
  '#997AFE',
  '#BD1520',
  '#D73A4A',
  '#A917FD',
  '#D4B11A',
  '#9CA760',
  '#692B46',
  '#01B42F',
  '#67BFC3',
  '#7A109D',
  '#F53E54',
  '#9DA09D',
  '#E973BF'
];

function stringToHash(text: string) {
  let hash = 0;
  if (text.length === 0) {
    return hash;
  }

  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }

  return hash;
}

function hexToRgb(hex: string) {
  // Remove the # if present
  hex = hex.replace(/^#/, '');

  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

export function generateTagColor(text: string | number) {
  text = `${text}`;

  const index = stringToHash(text) % BACKGROUND_COLORS.length;
  const { r, g, b } = hexToRgb(BACKGROUND_COLORS[index]);

  const backgroundColor = `rgb(${r}, ${g}, ${b})`;

  // Calculate brightness to determine appropriate text color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const color = brightness > 128 ? '#000000' : '#ffffff';

  return { backgroundColor, color };
}
