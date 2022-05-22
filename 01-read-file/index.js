const fs = require('fs');
const path = require('path'); // нужен путь, т.к. чтение файла будет из корневой директории
const { stdout } = process; // нужен, т.к. с console.log автоматом добавится перевод строки

const stream = new fs.ReadStream((path.join(__dirname, 'text.txt')), 'utf-8'); // чтение из файла с преобразованием данных в строку
let data = '';
stream.on('data', chunk => data += chunk); // данные передаются частями и складываются в переменную data
stream.on('end', () => stdout.write(data)); // необходимо для завершения потока и вывода данных в консоль

stream.on('error', error => stdout.write('Error', error.message));