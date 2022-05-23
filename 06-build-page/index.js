const fs = require('fs');
const path = require('path');
const { stdout } = process;

// создание папки 'project-dist':
const destinationDir = path.join(__dirname, 'project-dist');

fs.mkdir(destinationDir, { recursive: true }, err => {
  if (err) throw err;
});

// создание файла index.html:
const templateReadStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
const componentsDir = path.join(__dirname, 'components');
let data = '';
templateReadStream.on('data', chunk => data += chunk); // template.html прочитан, его содержимое помещено в data
templateReadStream.on('end', () => {
  fs.readdir(componentsDir, {withFileTypes: true}, (err, files) => {
    if (err) console.error(err);  // прочитана папка components
    files.forEach(file => {       // работа с каждым файлом папки components
      const filePath = path.join(componentsDir, file.name);
      if (file.isFile() && path.extname(filePath) == '.html') {
        const componentReadStream = fs.createReadStream(filePath, 'utf-8'); // поток чтения файлов
        const componentFileName = file.name.split('.')[0]; // получение только имени файлов
        let componentData = '';
        componentReadStream.on('data', chunk => componentData += chunk); // содержимое файлов в переменной
        componentReadStream.on('end', () => {
          data = data.replace(`{{${componentFileName}}}`, componentData); // замена всех блоков с именами файлов в data на сами файлы
          data = data.replace('autofocus', 'autosave'); // отмена автофокуса внизу страницы
          if (data.includes('{{')) {
            data = data.replace(`{{${componentFileName}}}`, componentData);
          } else { 
            const htmlWriteStream = fs.createWriteStream(path.join(destinationDir, 'index.html'));
            htmlWriteStream.write(data); // стабилизация работы .replace()
          }            // запись в создаваемый index.html преобразованного содержимого переменной data
        });
      }
    });
  });
  console.log('Файл index.html создан');
});
templateReadStream.on('error', error => stdout.write('Error', error.message));

// создание файла style.css:
const stylesSourceDir = path.join(__dirname, 'styles'); // для "двойного" пути
const wreatableStream = fs.createWriteStream(path.join(destinationDir, 'style.css'));

fs.readdir(stylesSourceDir, {withFileTypes: true}, (err, files) => { // чтение содержимого каталога
  if (err) console.error(err);
  files.reverse().forEach(file => {       // способ обработки каждого файла
    const filePath = path.join(stylesSourceDir, file.name);
    const readableStream = fs.createReadStream(filePath, 'utf-8'); // чтение из файла-источника с преобразованием данных в строку    
    
    if (file.name === 'header.css') { // стили упорядочены с помощью reverse() и принудительной записи первым стилей хедера 
      let headerData = '';
      readableStream.on('data', chunk => headerData += chunk);
      readableStream.on('data', () => wreatableStream.write(headerData));
    }
    else if (file.isFile() && path.extname(filePath) == '.css' && file.name !== 'header.css') { // проверка на файл и расширение
           
      const filesContent = [];
      readableStream.on('data', chunk => filesContent.push(chunk));
      readableStream.on('end', () => filesContent.forEach(item => wreatableStream.write(`${item}\n`))); // запись всех остальных файлов стилей
      readableStream.on('error', error => console.log('Error', error.message));
    }
  });
  console.log('Файл style.css создан');
});

// копирование папки assets в project-dist:
function callback(err) {
  if (err) throw err;
}
  
const copyDir = (sourceDir, destinationDirAssets) => {
  
  fs.mkdir(destinationDirAssets, { recursive: true }, err => {
    if (err) throw err;
  });

  fs.readdir(sourceDir, {withFileTypes: true}, (err, files) => { // прочесть содержимое каталога
    if (err) console.error(err);
    files.forEach(file => {       // копирование каждого файла с подпапками
      if (file.isDirectory())
        copyDir(path.join(sourceDir, file.name), path.join(destinationDirAssets, file.name));
      else 
        fs.copyFile(path.join(sourceDir, file.name), path.join(destinationDirAssets, file.name), callback);
    });
  });
};
console.log('Файлы скопированы.');

copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));