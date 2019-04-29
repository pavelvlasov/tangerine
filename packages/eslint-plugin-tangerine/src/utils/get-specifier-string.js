const getSpecifierString = specifier => {
  if (specifier.type === 'ImportNamespaceSpecifier') {
    return `* as ${specifier.local.name}`;
  }
  return specifier.imported && specifier.local.name !== specifier.imported.name
    ? `${specifier.imported.name} as ${specifier.local.name}`
    : specifier.local.name;
};

module.exports = { getSpecifierString };
