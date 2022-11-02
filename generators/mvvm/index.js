/**
 * Container Generator
 */
const path = require('path');
const fs = require('fs');
const componentExists = require('../../lib/componentExists');
const templateConfigPath = path.resolve(process.cwd(), './template.config.js');

if (!fs.existsSync(templateConfigPath)) {
  console.error(
    '请在根目录创建template.config.js，并导出模板要生成的相对路径地址',
  );
  return false;
}
const dirToGenerate = path.join('../../../../', require(templateConfigPath));

module.exports = {
  description: 'Add a MVVM container in Application',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'Form',
      validate: (value) => {
        const checkPath = dirToGenerate;
        if (/.+/.test(value)) {
          return componentExists(checkPath, value)
            ? 'A container with this name already exists'
            : true;
        }

        return 'The name is required';
      },
    },
  ],
  actions: (data) => {
    const basePath = `${dirToGenerate}/{{properCase name}}`;
    const actions = [
      {
        type: 'add',
        path: `${basePath}/{{properCase name}}.View.tsx`,
        templateFile: './MVVM/view.tsx.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${basePath}/{{properCase name}}.ViewModel.ts`,
        templateFile: './MVVM/viewModel.ts.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${basePath}/types.ts`,
        templateFile: './MVVM/types.ts.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${basePath}/index.ts`,
        templateFile: './MVVM/index.ts.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${basePath}/constants.ts`,
        templateFile: './MVVM/constants.ts.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${basePath}/index.module.less`,
        templateFile: './MVVM/index.module.less.hbs',
        abortOnFail: true,
      },
    ];

    return actions;
  },
};
