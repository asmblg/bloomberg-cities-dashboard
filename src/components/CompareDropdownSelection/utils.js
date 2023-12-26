export function handleSearch(text, search) {
  const searchArr = search.split(' ');

  const isMatch = searchArr.some(substring => {
    const regex = new RegExp(substring, 'i'); // makes regex case-insensitive
    return regex.test(text);
  });

  return isMatch;
}