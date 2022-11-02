/**
 * componentExists
 *
 * Check whether the given component exist in either the components or containers directory
 */

const fs = require('fs');
const path = require('path');

function componentExists(checkPath, comp) {
  const pageContainers = fs.readdirSync(path.join(__dirname, checkPath));
  const components = pageContainers;
  return components.indexOf(comp) >= 0;
}

module.exports = componentExists;
