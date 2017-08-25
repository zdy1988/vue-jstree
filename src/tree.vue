<template>
  <div :class="classes" role="tree" onselectstart="return false">
    <ul :class="containerClasses" role="group">
      <item v-for="(child, index) in data"
            :key="index"
            :id="child.id"
            :text="child.text"
            :value="child.value"
            :icon="child.icon"
            :opened.sync="child.opened"
            :selected="child.selected"
            :disabled="child.disabled"
            :children="child.children"
            :whole-row="wholeRow"
            :show-checkbox="showCheckbox"
            :loading="child.loading"
            :height="sizeHight"
            :parent-item="data"
            :draggable="draggable"
            :on-click="child.onClick"
            :on-toggle="child.onToggle"
            :on-drag-start="child.onDragStart"
            :on-drag-end="child.onDragEnd"
            :on-drop="child.onDrop"
            :klass="index === data.length-1?'tree-last':''">
      </item>
    </ul>
  </div>
</template>
<script>
  import Vue from 'vue'

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

  function handleRecursionNodeParents(node, func, stop) {
    if (node.$parent) {
      func(node.$parent)
      handleRecursionNodeParents(node.$parent, func)
    }
  }

  Vue.component('item', {
    template: `
      <li role="treeitem" :class="classes" :draggable="draggable"
          @dragstart.stop="onDragStart($event, _self)"
          @dragend.stop.prevent="onDragEnd($event, _self)"
          @dragover.stop.prevent="() => false"
          @dragenter.stop.prevent="isDragEnter = true"
          @dragleave.stop.prevent="isDragEnter = false"
          @drop.stop.prevent="onDrop($event, _self)">
        <div role="presentation" :class="wholeRowClasses" v-if="isWholeRow">&nbsp;</div>
        <i class="tree-icon tree-ocl" role="presentation" @click="handleToggle"></i>
        <div :class="anchorClasses" @click="onClick(_self)" @mouseover="hover=true" @mouseout="hover=false">
          <i class="tree-icon tree-checkbox" role="presentation" v-if="showCheckbox && !loading"></i>
          <i :class="themeIconClasses" role="presentation" v-if="!loading"></i>
          {{text}}
        </div>
        <ul role="group" ref="group" class="tree-children" v-if="isFolder">
          <item v-for="(child, index) in children"
                  :key="index"
                  :id="child.id"
                  :text="child.text"
                  :value="child.value"
                  :icon="child.icon"
                  :opened.sync="child.opened"
                  :selected="child.selected"
                  :disabled="child.disabled"
                  :children="child.children"
                  :whole-row="wholeRow"
                  :show-checkbox="showCheckbox"
                  :loading="child.loading"
                  :height="height"
                  :parent-item="children"
                  :draggable="draggable"
                  :on-click="child.onClick"
                  :on-toggle="child.onToggle"
                  :on-drag-start="child.onDragStart"
                  :on-drag-end="child.onDragEnd"
                  :on-drop="child.onDrop">
            </item>
        </ul>
      </li>`,
    props: {
      id: {type: Number},
      text: {type: String},
      value: {type: String},
      icon: {type: String},
      opened: {type: Boolean, default: false},
      selected: {type: Boolean, default: false},
      disabled: {type: Boolean, default: false},
      children: {type: Array},
      wholeRow: {type: Boolean, default: false},
      onClick: {
        type: Function, default: () => false
      },
      onToggle: {
        type: Function, default: () => false
      },
      onDragStart: {
        type: Function, default: () => false
      },
      onDragEnd: {
        type: Function, default: () => false
      },
      onDrop: {
        type: Function, default: () => false
      },
      showCheckbox: {type: Boolean, default: false},
      loading: {type: Boolean, default: false},
      height: {type: Number, default: ITEM_HEIGHT_DEFAULT},
      parentItem: {type: Array},
      draggable: {type: Boolean, default: false},
      klass: String
    },
    data () {
      return {
        open: this.opened,
        hover: false,
        isFolder: this.children && this.children.length > 0,
        isDragEnter: false
      }
    },
    computed: {
      classes () {
        return [
          {'tree-node': true},
          {'tree-open': this.open},
          {'tree-closed': !this.open},
          {'tree-leaf': !this.isFolder},
          {'tree-loading': this.loading},
          {'tree-drag-enter': this.isDragEnter},
          {[this.klass]: !!this.klass}
        ]
      },
      anchorClasses () {
        return [
          {'tree-anchor': true},
          {'tree-disabled': this.disabled},
          {'tree-clicked': this.selected},
          {'tree-hovered': this.hover}
        ]
      },
      wholeRowClasses () {
        return [
          {'tree-wholerow': true},
          {'tree-wholerow-clicked': this.selected},
          {'tree-wholerow-hovered': this.hover}
        ]
      },
      themeIconClasses () {
        return [
          {'tree-icon': true},
          {'tree-themeicon': true},
          {[this.icon]: !!this.icon},
          {'tree-themeicon-custom': !!this.icon}
        ]
      },
      isWholeRow () {
        if (this.wholeRow) {
          if (this.$parent.open === undefined) {
            return true
          } else if (this.$parent.open === true) {
            return true
          } else {
            return false
          }
        }
      }
    },
    watch: {
      open (newValue) {
        this.handleSetGroupMaxHeight()
        this.$emit('update:opened', newValue)
      },
      opened (newValue) {
        this.open = newValue
      },
      children (newValue) {
        this.isFolder = newValue && newValue.length > 0
      }
    },
    methods: {
      handleToggle () {
        if (this.isFolder) {
          this.open = !this.open
          this.onToggle(this._self, this.open)
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
        var self = this
        this.$nextTick(() => {
          handleRecursionNodeParents(self, node => {
            if (node.$refs.group) {
              node.$refs.group.style.maxHeight = node.handleGroupMaxHeight() + 'px'
            }
          })
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
      wholeRow: {type: Boolean, default: false},
      noDots: {type: Boolean, default: false},
      multiple: {type: Boolean, default: false},
      allowBatch: {type: Boolean, default: false},
      textFieldName: {type: String, default: 'text'},
      valueFieldName: {type: String, default: 'value'},
      async: {type: Function},
      loadingText: {type: String, default: 'Loading...'},
      draggable: {type: Boolean, default: false},
      klass: String
    },
    data () {
      return {
        itemId: 1,
        draggedItem: null
      }
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
      containerClasses () {
        return [
          {'tree-container-ul': true},
          {'tree-children': true},
          {'tree-wholerow-ul': !!this.wholeRow},
          {'tree-no-dots': !!this.noDots}
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
      initializeData (items) {
        if (items && items.length > 0) {
          for (let item of items) {
            this.initializeDataItem(item)
            this.initializeData(item.children)
          }
        }
      },
      initializeDataItem (item) {
        item.id = item.id || this.itemId++
        item[this.textFieldName] = item[this.textFieldName] || ''
        item[this.valueFieldName] = item[this.valueFieldName] || item[this.textFieldName]
        item.icon = item.icon || ''
        item.opened = item.opened || false
        item.selected = item.selected || false
        item.disabled = item.disabled || false
        item.children = item.children || []
        item.onClick = node => this.handleItemClick(node, item)
        item.onToggle = (node, state) => this.handleItemToggle(node, item, state)
        item.onDragStart = (e, node) => this.handleItemDragStart(e, item, node)
        item.onDragEnd = (e, node) => this.handleItemDragEnd(e, item, node)
        item.onDrop = (e, node) => this.handleItemDrop(e, item, node)
        return item
      },
      initializeLoading () {
        return this.initializeDataItem({
          text: this.loadingText,
          disabled: true,
          loading: true
        })
      },
      handleSingleSelectItems (selectedItem, data) {
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
          this.handleSingleSelectItems(item, this.data)
        }
        this.$emit('item-click', item, node)
      },
      handleItemToggle (node, item, state) {
        if (state) {
          item.opened = state
          this.handleAsync(item.children, item)
        }
      },
      handleAsync (parent, parentItem) {
        if (this.async) {
          var self = this
          setTimeout(function () {
            var asyncData = self.async(parentItem)
            for (let i in asyncData) {
              var asyncDataItem = self.initializeDataItem(asyncData[i])
              asyncDataItem.children = [self.initializeLoading()]
              Vue.set(parent, i, asyncDataItem)
            }
          }, 500)
        }
      },
      handleItemDragStart (e, item, node) {
        if (!this.draggable)
          return false
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData('text', null)
        this.draggedItem = {
          item: item,
          parentItem: node.parentItem,
          index: node.parentItem.indexOf(item)
        }
      },
      handleItemDragEnd (e, item, node) {
        if (!this.draggable)
          return false
        this.draggedItem = null
      },
      handleItemDrop (e, item, node) {
        if (!this.draggable)
          return false
        if (this.draggedItem) {
          if (this.draggedItem.parentItem === item.children
            || this.draggedItem.item === item
            || item.children.indexOf(this.draggedItem.item) !== -1) {
            return;
          }
          item.children = item.children.concat(this.draggedItem.item)
          var self = this
          this.$nextTick(() => {
            self.draggedItem.parentItem.splice(self.draggedItem.index, 1)
          })
        }
      }
    },
    created () {
      this.initializeData(this.data)
    },
    mounted () {
      if (this.async) {
        Vue.set(this.data, 0, this.initializeLoading())
        this.handleAsync(this.data)
      }
    }
  }
</script>
<style lang="less">
  @import "./less/style";
</style>