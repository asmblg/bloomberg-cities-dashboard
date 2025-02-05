export async function getImage(project, category, key) {
  try {
    const fileName = key
      .split(' ')
      .map(str => str.trim().toLowerCase().replace(/\//g, '_')) // replaces '/' with '_' because file names will not contain '/'
      .join('-');

      console.log({project, category, fileName});

    // files must be a png and match current submarket key from config or nothing will be rendered
    const images = import.meta.glob('./submarketMaps/**/*.png');
    const imagePath = `./submarketMaps/${project.toLowerCase()}/${category.toLowerCase()}/${fileName}.png`;
    const img = images[imagePath] ? await images[imagePath]() : null;
    // Set style for image
    // if (img) {
    //   img.default = img.default || img;
    //   img.default.style = {
    //     width: '100px',
    //     height: '100px',
    //     // objectFit: 'contain'
    //   };
    // }
    return img;
  } catch (err) {
    if (err) {
      return null;
    }
  }
}
