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

| Props        | Type           | Default  |  Describe  |
| ------------- |:-------------:|:-----:|-----:|
| data      | Array |  |  set tree data  |
| size      | String      |   |  set tree item size , value : 'large' or '' or ''small' |
| showCheckbox | Boolean      |    false |   |
| wholeRow | Boolean      |    false |   |
| noDots | Boolean      |    false |  |
| collapse | Boolean      |    true |  set all tree item collapse state |
| multiple | Boolean      |    false |  set multiple selected tree item  |
| allowBatch | Boolean      |    false |   |
| textFieldName | String      |    'text' |  set tree item display field |
| valueFieldName | String      |    'value' |  set tree item value field |
| itemEvents | Object      |    {} |  register any event to tree item, example: itemEvents: {
                                                                                          mouseover: function () {
                                                                                            console.log('mouseover')
                                                                                          },
                                                                                          contextmenu: function () {
                                                                                            console.log('contextmenu')
                                                                                          }
                                                                                        } |
| async | Function      |     |  async load callback function  |
| loadingText | String      |    'Loading' |  set loading text |
| draggable | Boolean      |    false |  set tree item can be dragged |
| klass | String      |     |  set append tree class |

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