// Invalid: Relative imports 'up' don't follow folder structure

module.exports = `
import { } from '../../common';
import { } from '../../a';
import { } from '../../a/common';
import { } from '../../b';
import { } from '../../a/b/c';
import { } from '../d';
`;
