export function aggregate(records) {
  const result = [];
  for (const record of records) {
    const existing = result.find(item => item.id === record.id);
    if (existing) existing.value = record.value;
    else result.push({...record});
  }
  return result;
}
