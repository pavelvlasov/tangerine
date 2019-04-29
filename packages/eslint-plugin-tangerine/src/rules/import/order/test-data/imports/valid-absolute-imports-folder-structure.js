// Invalid: Absolute imports don't follow folder structure

module.exports = `
import { } from 'c';

import { } from 'b';

import { } from 'a/a';
import { } from 'a/b';
`;
