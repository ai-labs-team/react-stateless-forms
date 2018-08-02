import { chain, join, map, pipe, toPairs } from 'ramda';

export const paths = (obj: {}): string[][] => {
  const recurse = (value: {}, parents = []): any[] => {
    return chain<[any, {}], any[]>(
      ([key, nested]) => {
        const keys = parents.concat(key);

        if (Object.prototype.toString.call(nested) === '[object Object]') {
          return recurse(nested, keys);
        }

        return [keys];
      },
      toPairs(value)
    );
  };

  return recurse(obj);
};

export const dottedPaths: (obj: {}) => string[] = pipe(paths, map(join('.')));
