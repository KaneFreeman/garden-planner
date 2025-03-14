export function mapRecord<V, O>(input: Record<string, V>, converter: (value: V) => O): Record<string, O>;
export function mapRecord<V, O>(input: undefined, converter: (value: V) => O): Record<string, O>;
export function mapRecord<V, O>(input: Record<string, V> | undefined, converter: (value: V) => O): Record<string, O>;
export function mapRecord<V, O>(input: Record<string, V> | undefined, converter: (value: V) => O): Record<string, O> {
  if (!input) {
    return {};
  }

  return Object.keys(input).reduce(
    (map, key) => {
      map[key] = converter(input[key]);
      return map;
    },
    {} as Record<string, O>
  );
}
