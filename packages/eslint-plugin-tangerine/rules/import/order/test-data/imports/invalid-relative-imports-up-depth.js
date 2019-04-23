// Invalid: Relative imports 'up' don't follow depth order (../.. before ..)

module.exports = `
import { } from '../d';
import { } from '../../common';
import { } from '../../a';
import { } from '../../a/common';
import { } from '../../a/b/c';
import { } from '../../b';
`;
