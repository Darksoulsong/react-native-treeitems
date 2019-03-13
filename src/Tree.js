/**
 * @flow
 */

import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import {
  deepClone,
  uid,
  setStatus,
  getBranch,
  checkProps,
  getActiveItem,
  Touchable,
} from './utils';
import { ItemPressArgs, Props, State } from './typings';
import * as defaults from './defaults';

export default class TreeSlider extends Component<Props, State> {
  static defaultProps = {
    list: [],
    onItemPress: defaults.onItemPress,
    onPageChange: defaults.onPageChange,
    getRef: null,
    disabled: defaults.disabled,
  };

  state = {
    tree: [],
    treeBranchesItemsLength: [],
    activePageIndex: 0,
  };

  componentDidMount() {
    const { getRef } = this.props;
    const self = this;

    getRef({
      getBranch: () => getBranch(self.state.tree),
      goBack: this.goBack,
      goForward: this.goForward,
      getActivePageIndex: this.getActivePageIndex,
      getTree: this.getTree,
    });

    checkProps(this.props);

    this.init();
  }

  getActivePageIndex = () => this.state.activePageIndex;

  getTree = () => this.state.tree;

  init() {
    const { list } = this.props;
    const { treeBranchesItemsLength } = this.state;

    if (this.state.tree.length) {
      return;
    }

    treeBranchesItemsLength.push(list.length);

    this.setState(previousState => ({
      ...previousState,
      tree: [deepClone(list)],
      treeBranchesItemsLength,
      activePageIndex: 0,
    }));
  }

  onChange = async (current, index) => {
    const { nestedPropName } = this.props;
    const nestedItems = current[nestedPropName];
    const { activePageIndex } = this.state;

    setStatus(current, activePageIndex, this.state);

    if (!nestedItems) {
      this.props.onItemPress(current, index, activePageIndex, null, false);
      this.forceUpdate();
      return;
    }

    const newIndex = activePageIndex + 1;

    this.setState(
      previousState => {
        const { tree } = previousState;
        let { treeBranchesItemsLength } = this.state;

        // The pressing of the item cleans up the next sliders...
        tree.splice(newIndex);

        // ...and the items length array as well
        treeBranchesItemsLength.splice(newIndex);

        // Now we perform a reinitialization to the control variable,
        // by setting the length of the first branch,
        if (tree.length === 1) {
          treeBranchesItemsLength = [tree[0].length];
        }

        // and do an update to the tree branches control variable
        // by setting to it the length of the newly added nested item
        if (nestedItems && nestedItems.length) {
          treeBranchesItemsLength.push(nestedItems.length);
          tree.push(nestedItems);
        }

        return {
          ...previousState,
          tree,
          treeBranchesItemsLength,
        };
      },
      async () => {
        this.changePage({
          current,
          itemIndex: index,
          oldPageIndex: activePageIndex,
          newPageIndex: newIndex,
          hasChildren: !!nestedItems && !!nestedItems.length,
        });
      },
    );
  };

  async go(page) {
    const { tree, activePageIndex } = this.state;
    const idx = activePageIndex + page;

    // going back
    if (page < 0) {
      this.setState(previousState => ({
        ...previousState,
        activePageIndex: idx,
      }));
    }

    if (tree[idx]) {
      this.changePage({ newPageIndex: idx });
    }
  }

  goBack = () => {
    this.go(-1);
  };

  goForward = () => {
    this.go(1);
  };

  changePage = async (options: ItemPressArgs) => {
    const { tree } = this.state;
    const {
      current,
      itemIndex,
      oldPageIndex,
      newPageIndex,
      hasChildren,
    } = options;

    const goingBack = !!current === false;
    const shouldTrigger = goingBack === false;

    if (!tree[newPageIndex]) {
      // triggers on item forward press
      this.props.onItemPress(
        current,
        itemIndex,
        oldPageIndex,
        null,
        hasChildren,
      );

      return;
    }

    /* eslint-disable */
    return new Promise(res => {
      // triggers on page swipe
      this.props.onPageChange();

      if (shouldTrigger) {
        // triggers on item forward press
        this.props.onItemPress(
          current,
          itemIndex,
          oldPageIndex,
          newPageIndex,
          hasChildren,
        );

        this.setState(previousState => ({
          ...previousState,
          activePageIndex: newPageIndex,
        }));
      }

      res();
    });
    /* eslint-enable */
  };

  render() {
    const { tree, activePageIndex } = this.state;
    const { renderBackButton, renderLoader, disabled } = this.props;
    const activeItem = getActiveItem(tree, activePageIndex);

    return (
      <View>
        {renderBackButton !== undefined && activePageIndex !== 0 && (
          <Touchable disabled={disabled} onPress={this.goBack}>
            {renderBackButton()}
          </Touchable>
        )}

        <View>
          {tree.map((arr, pageIndex) => (
            <View key={`main-${uid()}`} style={{ display: 'flex' }}>
              {activePageIndex === pageIndex && (
                <View
                  key={`page-${uid()}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyItems: 'flex-start',
                  }}
                >
                  <View>
                    {arr.map((item, index) => {
                      if (
                        disabled &&
                        typeof renderLoader === 'function' &&
                        activeItem === item
                      ) {
                        return renderLoader();
                      }

                      return (
                        <Touchable
                          disabled={disabled}
                          key={`item-${uid()}`}
                          onPress={() => {
                            let timer = setTimeout(() => {
                              this.onChange(item, index, pageIndex);
                              clearTimeout(timer);
                              timer = null;
                            }, 500);
                          }}
                        >
                          {this.props.renderItem(item, index)}
                        </Touchable>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  }
}
