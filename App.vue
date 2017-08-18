<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>Tree</h2>
    <div style="width:840px; margin: 0 auto;">
      <tree :data="data" show-checkbox multiple allow-batch @item-click="itemClick" style="width:50%; float:left;"></tree>
      <div style="width:50%; float:left;">
        <textarea  style="height:300px; width:100%;">
          {{data}}
        </textarea>
      </div>
    </div>

  </div>
</template>

<script>
  import Tree from './src/tree.vue'
  export default {
    name: 'app',
    data () {
      return {
        msg: 'A Tree Plugin For Vue2',
        data: [
          {
            "text": "Same but with checkboxes",
            "opend": true,
            "children": [
              {
                "text": "initially selected",
                "state": {
                  "selected": true
                }
              },
              {
                "text": "custom icon",
                "icon": "fa fa-warning icon-state-danger"
              },
              {
                "text": "initially open",
                "icon": "fa fa-folder icon-state-default",
                "state": {
                  "opened": true
                },
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
            "opend": true,
            "children": [
              {
                "text": "initially selected",
                "state": {
                  "selected": true
                }
              },
              {
                "text": "custom icon",
                "icon": "fa fa-warning icon-state-danger"
              },
              {
                "text": "initially open",
                "icon": "fa fa-folder icon-state-default",
                "state": {
                  "opened": true
                },
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
      }
    },
    methods: {
      itemClick (item) {
        console.log(item.text + ' clicked !')
      }
    },
    components: {
      Tree
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
