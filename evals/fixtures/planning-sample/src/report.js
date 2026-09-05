export function format(records) {
  return records.map(({id, value}) => `${id},${value}`).join('\n');
}
