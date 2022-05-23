const fs = require('fs');
const path = require('path');

function callback(err) {
  if (err) throw err;
} // вариант колбэка в виде отдельной функции

const copyDir = (sourceDir, destinationDir) => {
  
  fs.mkdir(destinationDir, { recursive: true }, err => {
    if (err) throw err;
  }); // создание директории

  fs.readdir(destinationDir, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(destinationDir, file), err => {
        if (err) throw err;
      });
    }
  }); // сокращенный аналог fs.rm - удаляет по 1 файлу (перезапись содержимого destination)

  fs.readdir(sourceDir, {withFileTypes: true}, (err, files) => { // описание в fs.readdir: читает содержимое каталога
    if (err) console.error(err);
    files.forEach(file => {       // копирование каждого файла
      if (file.isDirectory())
        copyDir(path.join(sourceDir, file.name), path.join(destinationDir, file.name));
      else 
        fs.copyFile(path.join(sourceDir, file.name), path.join(destinationDir, file.name), callback); // "двойной" путь для правильного адреса
    });
  });
  console.log('Файлы скопированы.');
};

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));