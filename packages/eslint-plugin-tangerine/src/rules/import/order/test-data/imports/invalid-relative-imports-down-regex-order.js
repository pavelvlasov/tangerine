// Invalid: Relative imports 'down' don't follow regex order (common before rest)

module.exports = `
import { } from './x';
import { } from './x/z';
import { } from './y';
import { } from './common';
`;
