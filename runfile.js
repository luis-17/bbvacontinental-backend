const { run } = require('runjs');

const generateKeys = (name, out = '.keys') => {
  run(`mkdir -p ${out}`);
  run(`rm -rf ${out}/*`);
  run(`openssl genrsa -out ${out}/${name}-private.rsa 4096`);
  run(`openssl rsa -in ${out}/${name}-private.rsa -pubout > ${out}/${name}-public.pem`);
};

const restart = () => {
  run('sequelize db:migrate:undo:all');
  run('sequelize db:migrate');
  run('sequelize db:seed:all');
};

module.exports = {
  'generate:keys': generateKeys,
  'db:restart': restart,
};
