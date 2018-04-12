# vue-jstree

A tree plugin for vue2

![tree](./pic.png)

##  DEMO

[http://zdy1988.github.io/vue-jstree](http://zdy1988.github.io/vue-jstree)

##  NPM

```html
    npm install vue-jstree
```

##  ES6

```html
    import VJstree from 'vue-jstree'
    
    new Vue({
      components: {
        VJstree
      }
    })
```

##  Setup

```html
    npm install
    npm run dev
```

## Usage

```html
    <v-jstree :data="data" show-checkbox multiple allow-batch whole-row @item-click="itemClick"></v-jstree>
    
    new Vue({
      data: {
        data: [
          {
            "text": "Same but with checkboxes",
            "children": [
              {
                "text": "initially selected",
                "selected": true
              },
              {
                "text": "custom icon",
                "icon": "fa fa-warning icon-state-danger"
              },
              {
                "text": "initially open",
                "icon": "fa fa-folder icon-state-default",
                "opened": true,
                "children": [
                  {
                    "text": "Another node"
                  }
                ]
              },
              {
                "text": "custom icon",
                "icon": "fa fa-warning icon-state-warning"
              },
              {
                "text": "disabled node",
                "icon": "fa fa-check icon-state-success",
                "disabled": true
              }
            ]
          },
          {
            "text": "Same but with checkboxes",
            "opened": true,
            "children": [
              {
                "text": "initially selected",
                "selected": true
              },
              {
                "text": "custom icon",
                "icon": "fa fa-warning icon-state-danger"
              },
              {
                "text": "initially open",
                "icon": "fa fa-folder icon-state-default",
                "opened": true,
                "children": [
                  {
                    "text": "Another node"
                  }
                ]
              },
              {
                "text": "custom icon",
                "icon": "fa fa-warning icon-state-warning"
              },
              {
                "text": "disabled node",
                "icon": "fa fa-check icon-state-success",
                "disabled": true
              }
            ]
          },
          {
            "text": "And wholerow selection"
          }
        ]
      },
      methods: {
        itemClick (node) {
          console.log(node.model.text + ' clicked !')
        }
      }
    })
```

## API

| Props        | Type           | Default  |
| ------------- |:-------------:| -----:|
| data      | Array |  |
| size      | String      |   |
| showCheckbox | Boolean      |    false |
| wholeRow | Boolean      |    false |
| noDots | Boolean      |    false |
| multiple | Boolean      |    false |
| allowBatch | Boolean      |    false |
| allowContextMenu | Boolean      |    false |
| textFieldName | Boolean      |    'text' |
| valueFieldName | Boolean      |    'value' |
| async | Function      |     |
| loadingText | String      |    'Loading' |
| draggable | Boolean      |    false |
| klass | String      |     |

## Methods in node.model

| Method        | Params        |
| ------------- |:-------------:|
| addChild      | (object) newDataItem |
| addAfter      | (object) newDataItem, (object) selectedNode |
| addBefore     | (object) newDataItem, (object) selectedNode |
| openChildren  |  |
| closeChildren  |  |

## Event

**@item-click**

**@item-toggle**

**@context-menu**

This event will be emitted when the `allow-context-menu` prop is supplied and the user context-clicks an item in the tree. It is up to the user to implement the context menu itself. 

The event callback function will receive two arguments:
- `model` - the data item from your array that was context-clicked
- `event` - the window mouse-event


## Data Item Optional Properties

| Name        | Type           | Default  |
| ------------- |:-------------:| -----:|
| icon      | String      |   |
| opened | Boolean      |    false |
| selected | Boolean      |    false |
| disabled | Boolean      |    false |


## License

Licensed under the [MIT license](https://opensource.org/licenses/mit-license.php).

Thanks For [jstree](https://github.com/vakata/jstree)'s UI