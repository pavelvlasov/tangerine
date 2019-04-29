/**
 * @file 1) <Rule description>
 *
 * 2) [Additional information about the rule, e.g. extra properties that can be passed]
 */

module.exports = {
  meta: {
    // 3) Have properties in sorted order
    docs: {
      description: '<rule description>', // use .md notations here, bc this will be displayed in main README.md file
    },
  },
  onProject({ config, dependencies, files, rootPath }) {
    return [
      // ...
    ];
  },
};
