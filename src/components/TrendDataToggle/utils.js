const handleSetter = (setterKey, value) => {
  return new Promise((resolve, reject) => {
    if (setterKey && value) {
      resolve({ setterKey, value });
    } else if (value) {
      resolve({ value });
    } else {
      reject();
    }
  });
};

export { handleSetter };
