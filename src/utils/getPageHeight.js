/**
 * @flow
 */

import uid from './uid';

// The container doesn't grow by itself, so it must be set programatically
export default function getPageHeight(treeBranchesItemsLength: number[], listItemHeight: number) {
  // This is a hack to trigger the ViewPagerAndroid component rendering
  const pagerHack = +uid(1);

  return Math.max(...treeBranchesItemsLength) * listItemHeight + pagerHack;
}
