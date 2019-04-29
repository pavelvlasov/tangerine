// Invalid: Relative imports 'down' don't follow folder structure

module.exports = `
import { } from './common';
import { } from './x';
import { } from './x/z';
import { } from './y';
`;
