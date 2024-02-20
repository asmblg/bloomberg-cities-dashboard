export function handleSearch(text, search) {
  const searchArr = search.split(' ');

  const isMatch = searchArr.some(substring => {
    const regex = new RegExp(substring, 'i'); // makes regex case-insensitive
    return regex.test(text);
  });

  return isMatch;
}

// export function sortOptions(arr, firstOption) {
//   if (arr?.[0]) {
//     const sortedArr = [...arr].sort((a, b) =>
//       a.text.localeCompare(b.text)
//     );

//     if (firstOption) {
//       const firstOptionsArr = Array.isArray(firstOption) ? firstOption : [firstOption];
//       const firstOptionIndex = sortedArr.findIndex(entry => firstOptionsArr.includes(entry.text));
//       console.log(firstOptionsArr, firstOptionIndex);

//       if (firstOptionIndex !== -1) {
//         const [matchingEntry] = sortedArr.splice(firstOptionIndex, 1);
//         // Move it to the beginning of the array
//         sortedArr.unshift(matchingEntry);
//       }
//       return sortedArr;
//     }
//   }
//   return arr;
// }

export function sortOptions(arr, firstOption) {
  // Check if the array exists and has at least one entry
  if (!arr?.length) return arr;

  // Create a deep copy of the array and sort it
  const sortedArr = [...arr].sort((a, b) => a.text.localeCompare(b.text));

  // Check if firstOption is an object (and not an array) with keys
  if (typeof firstOption === 'object' && firstOption !== null && !Array.isArray(firstOption) && Object.keys(firstOption).length > 0) {
    // Attempt to find an index of an entry in sortedArr that matches all key-value pairs in firstOption
    // const firstOptionIndex = sortedArr.findIndex(entry => 
    //   Object.keys(firstOption).every(key => entry[key] === firstOption[key])
    // );

    // if (firstOptionIndex !== -1) {
    //   // If a matching entry is found, move it to the beginning of the array
    //   const [matchingEntry] = sortedArr.splice(firstOptionIndex, 1);
    sortedArr.unshift(firstOption);
    // }
  } else if (firstOption) {
    // Handle the case where firstOption is not an object with keys (e.g., a string or a number)
    const firstOptionsArr = Array.isArray(firstOption) ? firstOption : [firstOption];
    const firstOptionIndex = sortedArr.findIndex(entry => firstOptionsArr.includes(entry.text));

    if (firstOptionIndex !== -1) {
      // If a matching entry is found, move it to the beginning of the array
      const [matchingEntry] = sortedArr.splice(firstOptionIndex, 1);
      sortedArr.unshift(matchingEntry);
    }
  }

  return sortedArr;
}
