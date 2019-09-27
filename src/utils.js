import isUrl from 'is-url-superb';
import corsImport from './corsImport';

export const getChunkPath = (basePath, nameSpace, module) => {
  if (!window.entryManifest) return;
  if (!nameSpace) return;
  if (!window.entryManifest[nameSpace]) return;
  let pathString = [];
  if (window?.entryManifest[nameSpace]
        && window?.entryManifest[nameSpace][module]
        && window?.entryManifest[nameSpace][module].path) {
    pathString = [basePath, window.entryManifest[nameSpace][module].path];
  } else if (window?.entryManifest[nameSpace]
        && window?.entryManifest[nameSpace][`${module}.js`]
        && window?.entryManifest[nameSpace][`${module}.js`].path) {
    pathString = [basePath, window.entryManifest[nameSpace][`${module}.js`].path];
  }

  return pathString.join('');
};


export const getChunkDependencies = (basePath, nameSpace, module) => {
  if (!window.entryManifest) return;
  if (!nameSpace) return;
  if (!window.entryManifest[nameSpace]) return;
  const dependencyPaths = [];
  if (window?.entryManifest[nameSpace]
        && window?.entryManifest[nameSpace][module]
        && window?.entryManifest[nameSpace][module].dependencies) {
    window.entryManifest[nameSpace][module].dependencies.forEach((file) => {
      if (!__webpack_modules__[file.id]) {
        file.sourceFiles.forEach(chunkFile => dependencyPaths.push(basePath + window?.entryManifest[nameSpace][chunkFile].path));
      }
    });
  } else if (window?.entryManifest[nameSpace]
        && window?.entryManifest[nameSpace][`${module}.js`]
        && window?.entryManifest[nameSpace][`${module}.js`].dependencies) {
    window.entryManifest[nameSpace][`${module}.js`].dependencies.forEach((file) => {
      if (!__webpack_modules__[file.id]) {
        file.sourceFiles.forEach(chunkFile => dependencyPaths.push(basePath + window?.entryManifest[nameSpace][chunkFile].path));
      }
    });
  }
  return Array.from(new Set(dependencyPaths));
};


function getInSequence(array, asyncFunc) {
  return array.reduce((previous, current) => (
    previous.then(accumulator => (
      asyncFunc(current).then(result => accumulator.concat(result))
    ))
  ), Promise.resolve([]));
}

const nativeImport = src => new Promise((resolve, reject) => {
  if (isUrl(src)) {
    resolve(new Function(`return import("${src}")`)());
  } else {
    reject('webpack-external-import: nativeImport - invalid URL');
  }
});

export const importWithDependencies = (basePath, nameSpace, module, cors = false) => {
  if (!window.entryManifest) return;
  if (!nameSpace) return;
  if (!window.entryManifest[nameSpace]) return;
  const importFunction = cors ? nativeImport : corsImport;

  return getInSequence(getChunkDependencies(basePath, nameSpace, module), importFunction).then(() => importFunction(getChunkPath(basePath, nameSpace, module)));
};


export const importDependenciesOf = (basePath, nameSpace, module, cors = false) => {
  if (!window.entryManifest) return;
  if (!nameSpace) return;
  if (!window.entryManifest[nameSpace]) return;
  const importFunction = cors ? nativeImport : corsImport;


  return getInSequence(getChunkDependencies(basePath, nameSpace, module), importFunction).then(() => getChunkPath(basePath, nameSpace, module));

  // window.entryManifest[nameSpace][module]
  // console.log('import with deps:')
};
