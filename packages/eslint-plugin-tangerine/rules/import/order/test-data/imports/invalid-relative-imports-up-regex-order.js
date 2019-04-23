// Invalid: Relative imports 'up' don't follow regex order (common before rest)

module.exports = `
import { } from '../../common';
import { } from '../../a';
import { } from '../../a/b/c';
import { } from '../../a/common';
import { } from '../../b';
import { } from '../d';
`;
