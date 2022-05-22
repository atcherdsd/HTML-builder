const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err, files) => { // описание в fs.readdir: читает содержимое каталога
  if (err) console.error(err);
  files.forEach(file => {       // формат вывода информации для каждого файла
    if (file.isFile()) {        // проверка на файл, здесь возможна за счет функционала объекта fs.Dirent в связи с флагом true,
    // также такая проверка возможна ниже внутри fs.stat как stats.isFile(file)
      const filePath = path.join(__dirname, 'secret-folder', file.name);
      fs.stat(filePath, (err, stats) => { // доступ к характеристикам файла, описание в fs.stat
        if (err) console.error(err);
        console.log(`${file.name.split('.')[0]} - ${path.extname(filePath).slice(1)} - ${stats.size}b`);
      });
    }
  });
});