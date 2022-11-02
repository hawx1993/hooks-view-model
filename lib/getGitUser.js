const exec = require('child_process').execSync;

function getGitUser() {
  let gitUser = {};
  try {
    gitUser.name = exec('git config --get user.name');
    gitUser.email = exec('git config --get user.email');
  } catch (e) {
    console.log(e.message);
  }
  gitUser.name =
    gitUser.name && JSON.stringify(gitUser.name.toString().trim()).slice(1, -1);
  gitUser.email =
    gitUser.email && gitUser.email.toString().toLocaleLowerCase().trim();
  return gitUser;
}

module.exports = getGitUser;
