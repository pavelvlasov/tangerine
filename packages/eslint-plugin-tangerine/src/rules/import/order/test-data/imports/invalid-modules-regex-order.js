// Invalid: Modules don't match regex order (react before redux)

module.exports = `
import { } from 'redux';
import { } from 'react';
`;
