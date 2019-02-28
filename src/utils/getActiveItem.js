// @flow

type TTree = { [x: string]: any }[][];

export default function getActiveItem(tree: TTree, index: number) {
  const page = tree[index];

  if (!page) {
    return false;
  }

  return page.find(x => x.active === true);
}
