const fs = require('fs');
const path = require('path');

const stylesSourceDir = path.join(__dirname, 'styles'); // для "двойного" пути
const destinationDir = path.join(__dirname, 'project-dist');
const wreatableStream = fs.createWriteStream(path.join(destinationDir, 'bundle.css'));

fs.readdir(stylesSourceDir, {withFileTypes: true}, (err, files) => { // чтение содержимого каталога
  if (err) console.error(err);
  files.forEach(file => {       // способ обработки каждого файла
    const filePath = path.join(stylesSourceDir, file.name);
        
    if (file.isFile() && path.extname(filePath) == '.css') { // проверка на файл и расширение
      
      const readableStream = fs.createReadStream(filePath, 'utf-8'); // чтение из файла с преобразованием данных в строку
      const filesContent = [];
      readableStream.on('data', chunk => filesContent.push(chunk)); // данные передаются частями и складываются в (по заданию) массив data
      readableStream.on('end', () => filesContent.forEach(item => wreatableStream.write(`${item}\n`))); // запись данных в файл по частям, иначе ошибка
      readableStream.on('error', error => console.log('Error', error.message));
    }
  });
  console.log('Файл создан');
});