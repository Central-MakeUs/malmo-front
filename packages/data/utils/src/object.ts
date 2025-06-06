export function cleanEmptyKeys(search: Record<string, any>) {
  const newSearch = { ...search }
  Object.keys(newSearch).forEach((key) => {
    const value = newSearch[key]
    if (value === undefined || value === '' || (typeof value === 'number' && isNaN(value))) delete newSearch[key]
  })
  return newSearch
}
