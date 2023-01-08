// By default in typescript, the module resolution resolves the import using only the files with extension: .ts .tsx or .d.ts
// this is the reason why all modules with other extensions couldn't be found.
declare module "*.jpg";
declare module "*.png";
declare module "*.ico";
