<template>
  <div :class="classes" role="tree" v-if="data.length > 0">
    <ul class="tree-container-ul tree-children" role="group">
      <item v-for="(child, index) in data"
            :key="index"
            :id="child.id"
            :text="child.text"
            :value="child.value"
            :icon="child.icon"
            :opend="child.opend"
            :selected="child.selected"
            :disabled="child.disabled"
            :children="child.children"
            :show-checkbox="showCheckbox"
            :height="sizeHight"
            :onclick="child.onclick"
            :klass="index === data.length-1?'tree-last':''">
      </item>
    </ul>
  </div>
</template>
<script>
  import Vue from 'vue'

  let ITEM_ID = 1
  let ITEM_HEIGHT_SMALL = 18
  let ITEM_HEIGHT_DEFAULT = 24
  let ITEM_HEIGHT_LARGE = 32

  function handleRecursionDataChilds (items, func) {
    if (items && items.length > 0) {
      for (let i in items) {
        var item = items[i]
        func(items, item, i)
        if (item.children && item.children.length > 0) {
          handleRecursionDataChilds(item.children, func)
        }
      }
    }
  }
  
  function handleRecursionNodeChilds(node, func) {
    if (node.$children && node.$children.length > 0) {
      for (let childNode of node.$children) {
        if (!childNode.disabled) {
          func(childNode)
          handleRecursionNodeChilds(childNode, func)
        }
      }
    }
  }

  function handleRecursionNodeParents(node, func) {
    if (node.$parent) {
      func(node.$parent)
      handleRecursionNodeParents(node.$parent, func)
    }
  }

  Vue.component('item', {
    template: `
      <li role="treeitem" :class="classes">
        <i class="tree-icon tree-ocl" role="presentation" @click="handleToggle"></i>
        <a :class="anchorClass" href="javascript:;" @click="onclick(_self)">
          <i class="tree-icon tree-checkbox" role="presentation" v-if="showCheckbox"></i>
          <i class="tree-icon tree-themeicon" role="presentation"></i>
          {{text}}
        </a>
        <ul role="group" ref="group" class="tree-children" v-if="isFolder">
            <item v-for="(child, index) in children"
                  :key="index"
                  :id="child.id"
                  :text="child.text"
                  :value="child.value"
                  :icon="child.icon"
                  :opend="child.opend"
                  :selected="child.selected"
                  :disabled="child.disabled"
                  :children="child.children"
                  :show-checkbox="showCheckbox"
                  :height="height"
                  :onclick="child.onclick">
            </item>
        </ul>
      </li>`,
    props: {
      id: {type: Number},
      text: {type: String},
      value: {type: String},
      icon: {type: String},
      opend: {type: Boolean, default: false},
      selected: {type: Boolean, default: false},
      disabled: {type: Boolean, default: false},
      children: {type: Array},
      onclick: {type: Function, default: () => {}},
      showCheckbox: {type: Boolean, default: false},
      height: {type: Number, default: ITEM_HEIGHT_DEFAULT},
      klass: String
    },
    data () {
      return {
        open: this.opend
      }
    },
    computed: {
      classes () {
        return [
          {'tree-node': true},
          {'tree-open': this.open},
          {'tree-closed': !this.open},
          {'tree-leaf': !this.isFolder},
          {[this.klass]: !!this.klass}
        ]
      },
      anchorClass () {
        return [
          {'tree-anchor': true},
          {'tree-disabled': this.disabled},
          {'tree-clicked': this.selected}
        ]
      },
      isFolder () {
        return this.children &&
                this.children.length
      }
    },
    watch: {
      open () {
        this.handleSetGroupMaxHeight()
      }
    },
    methods: {
      handleToggle () {
        if (this.isFolder) {
          this.open = !this.open
        }
      },
      handleGroupMaxHeight () {
        let length = 0
        let childHeight = 0
        if (this.open) {
          length = this.$children.length
          for (let children of this.$children) {
            childHeight += children.handleGroupMaxHeight()
          }
        }
        return length * this.height + childHeight
      },
      handleSetGroupMaxHeight () {
        if (this.$refs.group) {
          this.$refs.group.style.maxHeight = this.handleGroupMaxHeight() + 'px'
        }
        handleRecursionNodeParents(this, node => {
          if (node.$refs.group) {
            node.$refs.group.style.maxHeight = node.handleGroupMaxHeight() + 'px'
          }
        })
      }
    },
    mounted () {
      this.handleSetGroupMaxHeight()
    }
  })

  export default {
    props: {
      data: {type: Array},
      size: {type: String, validator: value => ['large', 'small'].indexOf(value) > -1},
      showCheckbox: {type: Boolean, default: false},
      multiple: {type: Boolean, default: false},
      allowBatch: {type: Boolean, default: false},
      textFieldName: {type: String, default: 'text'},
      valueFieldName: {type: String, default: 'value'},
      klass: String
    },
    computed: {
      classes () {
        return [
          {'tree': true},
          {'tree-default': !this.size},
          {[`tree-default-${this.size}`]: !!this.size},
          {'tree-checkbox-selection': !!this.showCheckbox},
          {[this.klass]: !!this.klass}
        ]
      },
      sizeHight () {
        switch (this.size) {
          case 'large':
            return ITEM_HEIGHT_LARGE
          case 'small':
            return ITEM_HEIGHT_SMALL
          default:
            return ITEM_HEIGHT_DEFAULT
        }
      }
    },
    methods: {
      initData (items) {
        if (items && items.length > 0) {
          for (let item of items) {
            item.id = item.id || ITEM_ID++
            item[this.textFieldName] = item[this.textFieldName] || ''
            item[this.valueFieldName] = item[this.valueFieldName] || ''
            item.icon = item.icon || ''
            item.opend = item.opend || false
            item.selected = item.selected || false
            item.disabled = item.disabled || false
            item.children = item.children || []
            item.onclick = node=> this.handleItemClick(node, item)
            this.initData(item.children)
          }
        }
      },
      handleSelectItems (selectedItem, data) {
        handleRecursionDataChilds(data, (items, item, i) => {
          if (selectedItem === item) {
            item.selected = true
          } else {
            item.selected = false
          }
          Vue.set(items, i, item)
        })
      },
      handleMultipleSelectItems (selectedItem, data) {
        handleRecursionDataChilds(data, (items, item, i) => {
          if (selectedItem === item) {
            item.selected = !item.selected
            Vue.set(items, i, item)
          }
        })
      },
      handleBatchSelectItems (selectedItem, selectedNode, data) {
        let selectedArray = [selectedItem.id]
        let selected = !selectedItem.selected
        handleRecursionNodeChilds(selectedNode, node => selectedArray.push(node.id))
        handleRecursionDataChilds(data, (items, item, i) => {
          if (selectedArray.indexOf(item.id) > -1) {
            item.selected = selected
            Vue.set(items, i, item)
          }
        })
      },
      handleItemClick (node, item) {
        if (item.disabled) return
        if (this.multiple && this.showCheckbox) {
          if (this.allowBatch) {
            this.handleBatchSelectItems(item, node, this.data)
          } else {
            this.handleMultipleSelectItems(item, this.data)
          }
        } else {
          this.handleSelectItems(item, this.data)
        }
        this.$emit('item-click', item, node)
      }
    },
    created () {
      this.initData(this.data)
    }
  }
</script>
<style lang="less">
  @import "./less/style";
</style>