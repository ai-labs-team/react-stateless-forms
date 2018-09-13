import { all, chain, is, identity, join, map, merge, mergeDeepWith, nth, pipe, toPairs, union } from 'ramda';
import * as React from 'react';

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

/**
 * Accepts an object of key/function pairs and a pure component function, and returns
 * a new pure component that will generate and inject new props into the pass component
 * function.
 * @param  {Object<Function>} An object hash of functions used to generate new props
 * @param  {Component} A pure function that returns React DOM
 * @params {Object} Accepts props passed from parent
 * @return {Component} Returns a new component that generates new props from passed props
 *
 * @example
 * ```
 * const FullName = (props) => (<span>{props.fullName}</span>);
 *
 * const Name = withProps(
 *   {
 *     fullName: (props) => `${props.first} ${props.last}`
 *   },
 *   FullName
 * );
 *
 * <Name first="Bob" last="Loblaw" />
 * ```
 */
export type PropMap<Input, Generated> = {
  [K in keyof Generated]: (props: Input) => Generated[K]
};
export function withProps<Input, Generated>(
  fnMap: PropMap<Input, Generated>,
  component: React.StatelessComponent<Input & Generated>
) {
  return (props: Input) => component(merge(props, map(fn => fn(props), fnMap)) as Input & Generated);
}

export const cloneRecursive = (children, newProps): ReadonlyArray<any> => React.Children.map(children, (child) => {
  const mapProps = (child) => {
    const props = is(Function, newProps) ? newProps(child) : newProps;
    const hasChildren = child.props && child.props.children;
    const mapper: (any) => boolean = hasChildren && is(Array, child.props.children) ? identity : nth(0);
    const children = hasChildren ? mapper(cloneRecursive(child.props.children, newProps)) : null;
    return mergeDeep(props || {}, { children });
  };
  return React.isValidElement(child) ? React.cloneElement(child, mapProps(child)) : child;
});

/**
 * Deep-merges two objects, overwriting left-hand keys with right-hand keys, unionizing arrays.
 *
 * @param  {Object} left
 * @param  {Object} right
 * @return {Object}
 */
export const mergeDeep = mergeDeepWith((left, right) => (
  all(is(Array), [left, right]) ? union(left, right) : right
));
