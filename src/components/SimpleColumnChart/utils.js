function getStackedKeys(array) {
  const keysSet = new Set(); // using a Set to only allow unique values

  array.forEach(obj => {
    const objKeys = Object.keys(obj);
    objKeys.forEach(key => {
      if (key !== 'name') {
        keysSet.add(key); // Adding each key to the Set
      }
    });
  });

  return Array.from(keysSet);
}

export { getStackedKeys };