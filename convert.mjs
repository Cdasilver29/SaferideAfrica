import sharp from 'sharp';

async function run() {
  await sharp('C:\\Users\\Calvine Mugunda\\Desktop\\course-images\\Tuktuk.png').toFormat('webp').toFile('public\\gallery\\Tuktuk.webp');
  await sharp('C:\\Users\\Calvine Mugunda\\Desktop\\course-images\\truck-highway.png').toFormat('webp').toFile('public\\gallery\\truck-highway.webp');
  console.log('done');
}
run();
