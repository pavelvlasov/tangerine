// Invalid: Relative imports 'down' don't follow folder structure

module.exports = `
import { } from './common';
import { } from './x';
import { } from './y';
import { } from './x/z';
`;
