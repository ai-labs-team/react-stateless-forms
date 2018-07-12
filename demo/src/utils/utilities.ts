import {
  append, assocPath, chain, complement, contains, curry, defaultTo, either, flip, isEmpty, isNil, join, map, path, pipe,
  toPairs
} from 'ramda';

export const exists = complement(either(isEmpty, isNil));

export const appendTo = curry((data, model) => pipe(defaultTo([]), append(data))(model[model.stateKey]));

export const pickPaths = (paths: string[][], obj: {}) =>
  paths.reduce((result, pathItem) => {
    const value = path(pathItem, obj);

    return assocPath(pathItem, value, result);
  }, {});

export const paths = (obj: {}): string[][] => {
  const recurse = (value: {}, parents = []) => {
    return chain(([key, nested]) => {
      const keys = parents.concat(key);

      if (Object.prototype.toString.call(nested) === '[object Object]') {
        return recurse(nested, keys);
      }

      return [keys];
    }, toPairs(value));
  };

  return recurse(obj);
};

export const dottedPaths: (obj: {}) => string[] =
  pipe(
    paths,
    map(join('.'))
  );

export const optional = either(isNil);

export const oneOf = flip(contains);

export const memoize = (fn) => {
  const cache = {};

  return (...args) => {
    const stringifiedArgs = JSON.stringify(args);
    cache[stringifiedArgs] = cache[stringifiedArgs] || fn(...args);
  };
};
