/**
 * @file 1) <Rule description, can be the same as meta.docs.description>
 *
 * 2) [Additional information about the rule, e.g. extra properties that can be passed]
 */

module.exports = {
  meta: {
    // 3) Have properties in sorted order
    docs: {
      description: '<rule description>', // use .md notations here, bc this will be displayed in main README.md file
    },
    messages: {
      myInvalidMsgId: '<rule error message>', // 4) Change and use messageId to avoid duplication in index.js and test.js files (https://eslint.org/docs/developer-guide/working-with-rules#messageids)
    },
  },

  create(context) {
    return {
      // ...
    };
  },
};
