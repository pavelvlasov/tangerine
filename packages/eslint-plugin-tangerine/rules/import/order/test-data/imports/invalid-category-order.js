// Invalid: Absolute imports before module imports

module.exports = `
import { } from 'b';
import { } from 'a/a';
import { } from 'a/b';

import { } from 'react';
import { } from 'redux';
`;
