export function getImage(project, category, key) {
  try {
    const fileName = key
      .split(' ')
      .map(str => str.trim().toLowerCase().replace(/\//g, '_')) // replaces '/' with '_' because file names will not contain '/'
      .join('-');

    // files must be a png and match current submarket key from config or nothing will be rendered
    const img = require(`./submarketMaps/${project}/${category}/${fileName}.png`);
    return img || null;
  } catch (err) {
    if (err) {
      return null;
    }
  }
}
