const containerGenerator = require('./mvvm/index.js');
const getGitUser = require('../lib/getGitUser.js');
const getCurrentDate = require('../lib/getCurrentDate.js');

const gitUser = getGitUser();

module.exports = plop => {
  plop.setGenerator('container', containerGenerator);
  plop.setHelper('userName', () => gitUser.name);

  plop.setHelper('userEmail', () => gitUser.email);

  plop.setHelper('currentDate', () => getCurrentDate());
};
