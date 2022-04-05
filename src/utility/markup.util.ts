import React from 'react';

function Replace(str: string, find: RegExp, replace: React.ReactNode) {
  const parts = str.split(find);

  const result: React.ReactNode[] = [parts[0]];

  for (let i = 1; i < parts.length; i += 1) {
    result.push(replace);
    result.push(parts[i]);
  }
  return result;
}

export default function ReplaceAll(
  input: React.ReactNode[],
  find: RegExp,
  replace: React.ReactNode
): React.ReactNode[] {
  return input.flatMap((node) => {
    if (typeof node !== 'string') {
      return node;
    }

    return Replace(node, find, replace);
  });
}
