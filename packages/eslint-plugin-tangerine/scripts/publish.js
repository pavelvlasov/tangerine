const { execSync } = require('child_process');
const packageContents = require('../package.json');

const isPublished = !!execSync(`npm info ${packageContents.name}@${packageContents.version}`, {
  encoding: 'utf-8',
});

if (!isPublished) {
  execSync('npm publish');
} else {
  // eslint-disable-next-line no-console
  console.log(`${packageContents.name}@${packageContents.version} is already published`);
}
