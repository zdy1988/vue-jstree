<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>Tree View</h2>
    <div>
      <div style="width:840px; margin: 0 auto;">
        <div style="width:49%; display:inline-block; vertical-align: top;">
          <tree :data="data" show-checkbox multiple allow-batch whole-row @item-click="itemClick"></tree>
        </div>
        <div style="width:50%; display:inline-block;">
        <textarea  style="height:300px; width:100%;">
          {{data}}
        </textarea>
        </div>
      </div>
    </div>
    <h2>Async Loading</h2>
    <div>
      <div style="width:840px; margin: 0 auto;">
        <div style="width:49%; display:inline-block; vertical-align: top;">
          <tree :data="asyncData" :async="loadData" show-checkbox multiple allow-batch whole-row @item-click="itemClick"></tree>
        </div>
        <div style="width:50%; display:inline-block; vertical-align: top;">
        <textarea  style="height:300px; width:100%;">
          {{asyncData}}
        </textarea>
        </div>
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
        ],
        asyncData: [],
        loadData: (parent) => {
          var tag = !!parent && !!parent.id ? parent.id : ''
          return [
            {
              "text": "New Item 1..." + tag
            },
            {
              "text": "New Item 2..." + tag
            }
          ]
        }
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

div{
  display: block;
}
</style>
