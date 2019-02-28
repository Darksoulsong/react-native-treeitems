/**
 * @flow
 */

import { Tree } from '../typings';

export default function getBranch(tree: Tree) {
  return tree.reduce((a, c) => {
    const item = c.find(x => x.active === true);

    if (item) {
      a.push(item);
    }

    return a;
  }, []);
}
