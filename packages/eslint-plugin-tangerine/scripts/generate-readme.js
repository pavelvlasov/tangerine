const fs = require('fs');
const path = require('path');

const TEMPLATE_PATH = './templates/README.md';
const RULES_DIR_PATH = './src/rules';

const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

const categoryFolders = fs.readdirSync(RULES_DIR_PATH);

const categoryMarkdowns = categoryFolders.map(categoryFolder => {
  const categoryFolderPath = `${RULES_DIR_PATH}/${categoryFolder}`;
  const ruleFolders = fs.readdirSync(categoryFolderPath);

  const ruleMarkdowns = ruleFolders.map(ruleFolder => {
    const ruleFolderPath = `${categoryFolderPath}/${ruleFolder}`;

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const rule = require(path.resolve(`${ruleFolderPath}/index.js`));

    const fixableLabel = rule.meta.fixable ? ` 🔧` : '';

    return `- ${rule.meta.docs.description ||
      ruleFolderPath} ([${categoryFolder}/${ruleFolder}](${ruleFolderPath}/README.md)${fixableLabel})`;
  });

  return `### ${categoryFolder}\n\n${ruleMarkdowns.join('\n\n')}\n`;
});

const markdown = categoryMarkdowns.join('\n');
// this is not an error; we want to replace the actual string in `README.md` template file that has dollar and curlies in it
// eslint-disable-next-line no-template-curly-in-string
const output = template.replace('\\${rules}', markdown);

fs.writeFileSync('./README.md', output);
