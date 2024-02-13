export function handleSearch(text, search) {
  const searchArr = search.split(' ');

  const isMatch = searchArr.some(substring => {
    const regex = new RegExp(substring, 'i'); // makes regex case-insensitive
    return regex.test(text);
  });

  return isMatch;
}

export function sortOptions(arr, firstOption) {
  if (arr?.[0]) {
    const sortedArr = [...arr].sort((a, b) =>
      a.text.localeCompare(b.text)
    );

    if (firstOption) {
      const firstOptionsArr = Array.isArray(firstOption) ? firstOption : [firstOption];
      const firstOptionIndex = sortedArr.findIndex(entry => firstOptionsArr.includes(entry.text));
      console.log(firstOptionsArr, firstOptionIndex);

      if (firstOptionIndex !== -1) {
        const [matchingEntry] = sortedArr.splice(firstOptionIndex, 1);
        // Move it to the beginning of the array
        sortedArr.unshift(matchingEntry);
      }
      return sortedArr;
    }
  }
  return arr;
}