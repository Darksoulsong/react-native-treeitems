/**
 * @flow
 */
import { ReactElement } from 'react';
export type Tree = any[][];

export type Item = { [x: string]: any };

export type ItemPressArgs = {
  current: {},
  itemIndex: number,
  oldPageIndex: number,
  newPageIndex: number,
  hasChildren: boolean,
};

export type Props = {
  list: any[],
  nestedPropName: string,
  renderItem: (item: {}, index: number) => any,
  renderLoader: () => ReactElement,
  onItemPress?: (args: ItemPressArgs) => void,
  onPageChange?: (args: {}) => void,
  disabled?: boolean,
  getRef?: (
    getBranch: () => Item,
    goBack: () => void,
    goForward: () => void,
    getActivePageIndex: () => number,
    getTree: () => Item,
  ) => void,
};

export type State = {
  tree: Tree,
  treeBranchesItemsLength: number[],
  listItemHeight: number,
  activePageIndex: number,
};
