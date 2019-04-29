// Invalid: Absolute imports don't match regex order (b before rest)

module.exports = `
import { } from 'b';

import { } from 'a/a';
import { } from 'a/b';
`;
