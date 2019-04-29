const fs = require('fs');
const path = require('path');

const TEMPLATE_PATH = './templates/README.md';
const RULES_DIR_PATH = './src/rules';

const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

const ruleFolders = fs
  .readdirSync(RULES_DIR_PATH)
  .filter(file => fs.statSync(path.resolve(RULES_DIR_PATH, file)).isDirectory());

const ruleMarkdowns = ruleFolders.map(ruleFolder => {
  const ruleFolderPath = `${RULES_DIR_PATH}/${ruleFolder}`;
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const rule = require(path.resolve(`${ruleFolderPath}/index.js`));

  const fixableLabel = rule.meta.fixable ? ` 🔧` : '';

  return `- ${rule.meta.docs.description ||
    ruleFolderPath} ([${ruleFolder}](${ruleFolderPath}/README.md)${fixableLabel})`;
});

const markdown = ruleMarkdowns.join('\n');
// this is not an error; we want to replace the actual string in `README.md` template file that has dollar and curlies in it
// eslint-disable-next-line no-template-curly-in-string
const output = template.replace('\\${rules}', markdown);

fs.writeFileSync('./README.md', output);
