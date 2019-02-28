/**
 * @flow
 */
import { State } from '../typings';

export default function setStatus(
  current: {},
  parentKey: number,
  state: State,
) {
  const { tree } = state;

  tree[parentKey].forEach(item => (item.active = false));
  current.active = true;
}
