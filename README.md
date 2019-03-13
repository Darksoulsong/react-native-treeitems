# react-native-treeitems

A tree items component written for React Native.

## Demo

![react-native-treeitems sample](https://raw.githubusercontent.com/Darksoulsong/react-native-treeitems/master/treeitems-sample.gif)

## Quick Start

```
import React from 'react';
import TreeItems from 'react-native-treeitems';

const renderBackButton = () => {
  return (
    <CategoryItem>
      <Row>
        <Column size="0.05">
          <IconHolder>
            <Icon icon="angleLeft" />
          </IconHolder>
        </Column>
        <Column>
          <CategoryTitle>Go Back</CategoryTitle>
        </Column>
      </Row>
    </CategoryItem>
  );
};

function renderLoader() {
  return (
    <CategoryItem active>
      <Row>
        <Column>
          <CategoryTitle active>
            Loading. Please, wait...
          </CategoryTitle>
        </Column>
      </Row>
    </CategoryItem>
  );
}

function renderCategoryItem(item, index) {
  return (
    <CategoryItem active={item.active === true}>
      <Row>
        <Column>
          <CategoryTitle active={item.active === true}>
            {item.name}
          </CategoryTitle>
        </Column>
        <Column size={0.3}>
          <View style={{ flex: 1, alignSelf: 'flex-end' }}>
            {item.subcategories !== null &&
              'subcategories' in item === true && (
                <IconHolder>
                  <Icon
                    icon="angleRight"
                    color={item.active ? '#fff' : '#000'}
                  />
                </IconHolder>
              )}

            {(item.subcategories === null ||
              'subcategories' in item === false) && (
              <CategoryTotal active={item.active === true}>
                {item.quantity}
              </CategoryTotal>
            )}
          </View>
        </Column>
      </Row>
    </CategoryItem>
  );
}

function onPageChange() {
  ...
}

export default function ({ data }) {
  let treeItems;

  this.treeItemsOptions = {
    page: 0,
    renderBackButton,
    getRef: ref => {
      treeItems = {
        getBranch: ref.getBranch,
        getActivePageIndex: ref.getActivePageIndex,
        tree: ref.getTree(),
      };
    },
    onPageChange,
    list: categories,
    nestedPropName: 'subcategories',
    renderItem: renderCategoryItem,
    renderLoader,
    onItemPress: this.onItemPress,
  };

  return <TreeItems {...treeItemsOptions} />;
}

```

## Props

- `list: {[x: string]: any}[]` **(required)**  
  The data list. It is mandatory that the tree list has nested properties, like so:

  ```
  {
    name: 'Foo',
    ...
    subcategories: [{
      name: 'Bar',
      ...
      subcategories: [{...}]
    }]
  }
  ```

- `nestedPropName: string` **(required)**  
  The name of your list's nested property.

- `renderItem: (item: {}, index: number) => ReactElement` **(required)**  
  Callback which returns a React Element that represents a single item of your list.

- `onItemPress: (currentItem: {}, itemIndex: number, oldPageIndex: number, newPageIndex: number, hasChildren: boolean) => void`  
  A callback that is run when the list item is pressed.

- `onPageChange: (currentItem: {}, itemIndex: number, oldPageIndex: number, newPageIndex: number, hasChildren: boolean) => void`  
  A callback that is triggered on page change

- `disabled: boolean` **(defaults to false)**  
  Disables all the items from the tree.

- `getRef: (getBranch: () => void, goBack: () => void, goForward: () => void, getActivePageIndex: () => number, getTree: this.getTree ) => void`  
  Exposes some of the methods of the internal API through a react reference.
  - `getBranch()`: Returns the active branch and its nested active subitems.
  - `goBack()`: Programmatically slides the pager to the left.
  item in the current page).
  - `getActivePageIndex()`: Returns the index of the active page.
  - `getTree()`: Returns the parsed tree.

- `renderLoader: () => ReactElement`  
  This is a function that renders a loader element for the last clicked tree item, in place, if provided.

- `renderBackButton: () => ReactElement` **(required)**  
  Renders an element that will be used as your back button.

## Minimum Requirements

- "react": "16.6.3",
- "react-native": "0.58.4"
