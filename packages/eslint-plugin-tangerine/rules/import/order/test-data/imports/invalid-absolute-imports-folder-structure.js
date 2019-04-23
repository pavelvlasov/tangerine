// Invalid: Absolute imports don't follow folder structure

module.exports = `
import { } from 'a/a';
import { } from 'c';
import { } from 'a/b';
import { } from 'b';
`;
