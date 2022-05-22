const fs = require('fs');
const path = require('path');
const { stdout, stdin, stderr, exit } = process;

const input = fs.createWriteStream(path.join(__dirname, 'destination.txt')); // созданы поток записи, целевой файл
stdout.write('Hello, user! Enter some text:\n');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') 
    exit();
  input.write(data);
}); // аналог readline с ее line, но окончание exit вместо close

process.on('SIGINT', () => {
  exit();
}); // реакция на Ctrl + C = SIGINT
process.on('exit', code => {
  if (code === 0) {
    stdout.write('Goodbye!\n');
  } else {
    stderr.write(`App exited with code ${code}\n`);
  }
}); // действия перед завершением