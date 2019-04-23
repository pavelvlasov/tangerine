// Invalid: Modules don't match regex order (react before redux)

module.exports = `
import { } from 'react';

import { } from 'redux';
`;
