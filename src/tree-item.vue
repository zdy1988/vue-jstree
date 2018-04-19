<template>
    <li role="treeitem"
        :class="classes"
        :draggable="draggable"
        @dragstart.stop="onItemDragStart($event, _self, _self.model)"
        @dragend.stop.prevent="onItemDragEnd($event, _self, _self.model)"
        @dragover.stop.prevent="() => false"
        @dragenter.stop.prevent="isDragEnter = true"
        @dragleave.stop.prevent="isDragEnter = false"
        @drop.stop.prevent="handleItemDrop($event, _self, _self.model)">
        <div role="presentation" :class="wholeRowClasses" v-if="isWholeRow">&nbsp;</div>
        <i class="tree-icon tree-ocl" role="presentation" @click="handleItemToggle"></i>
        <div :class="anchorClasses" v-on="events">
            <i class="tree-icon tree-checkbox" role="presentation" v-if="showCheckbox && !model.loading"></i>
            <i :class="themeIconClasses" role="presentation" v-if="!model.loading"></i>
            <span v-html="model[textFieldName]"></span>
        </div>
        <ul role="group" ref="group" class="tree-children" v-if="isFolder">
            <tree-item v-for="(child, index) in model[childrenFieldName]"
                       :key="index"
                       :data="child"
                       :text-field-name="textFieldName"
                       :value-field-name="valueFieldName"
                       :children-field-name="childrenFieldName"
                       :item-events="itemEvents"
                       :whole-row="wholeRow"
                       :show-checkbox="showCheckbox"
                       :height= "height"
                       :parent-item="model[childrenFieldName]"
                       :draggable="draggable"
                       :on-item-click="onItemClick"
                       :on-item-toggle="onItemToggle"
                       :on-item-drag-start="onItemDragStart"
                       :on-item-drag-end="onItemDragEnd"
                       :on-item-drop="onItemDrop">
            </tree-item>
        </ul>
    </li>
</template>
<script>
  export default {
      name: 'TreeItem',
      props: {
          data: {type: Object, required: true},
          textFieldName: {type: String},
          valueFieldName: {type: String},
          childrenFieldName: {type: String},
          itemEvents: {type: Object},
          wholeRow: {type: Boolean, default: false},
          showCheckbox: {type: Boolean, default: false},
          height: {type: Number, default: 24},
          parentItem: {type: Array},
          draggable: {type: Boolean, default: false},
          onItemClick: {
              type: Function, default: () => false
          },
          onItemToggle: {
              type: Function, default: () => false
          },
          onItemDragStart: {
              type: Function, default: () => false
          },
          onItemDragEnd: {
              type: Function, default: () => false
          },
          onItemDrop: {
              type: Function, default: () => false
          },
          klass: String
      },
      data () {
          return {
              isHover: false,
              isDragEnter: false,
              model: this.data,
              events: {}
          }
      },
      watch: {
          isDragEnter (newValue) {
              if (newValue) {
                  this.$el.style.backgroundColor = "#C9FDC9"
              } else {
                  this.$el.style.backgroundColor = "inherit"
              }
          },
          data (newValue) {
              this.model = newValue
          },
          'model.opened': {
              handler: function (val, oldVal) {
                  this.onItemToggle(this, this.model)
                  this.handleSetGroupMaxHeight()
              },
              deep: true
          }
      },
      computed: {
          isFolder () {
              return this.model[this.childrenFieldName] && this.model[this.childrenFieldName].length
          },
          classes () {
              return [
                  {'tree-node': true},
                  {'tree-open': this.model.opened},
                  {'tree-closed': !this.model.opened},
                  {'tree-leaf': !this.isFolder},
                  {'tree-loading': !!this.model.loading},
                  {'tree-drag-enter': this.isDragEnter},
                  {[this.klass]: !!this.klass}
              ]
          },
          anchorClasses () {
              return [
                  {'tree-anchor': true},
                  {'tree-disabled': this.model.disabled},
                  {'tree-selected': this.model.selected},
                  {'tree-hovered': this.isHover}
              ]
          },
          wholeRowClasses () {
              return [
                  {'tree-wholerow': true},
                  {'tree-wholerow-clicked': this.model.selected},
                  {'tree-wholerow-hovered': this.isHover}
              ]
          },
          themeIconClasses () {
              return [
                  {'tree-icon': true},
                  {'tree-themeicon': true},
                  {[this.model.icon]: !!this.model.icon},
                  {'tree-themeicon-custom': !!this.model.icon}
              ]
          },
          isWholeRow () {
              if (this.wholeRow) {
                  if (this.$parent.model === undefined) {
                      return true
                  } else if (this.$parent.model.opened === true) {
                      return true
                  } else {
                      return false
                  }
              }
          }
      },
      methods: {
          handleRecursionNodeParents(node, func) {
              if (node.$parent) {
                  func(node.$parent)
                  this.handleRecursionNodeParents(node.$parent, func)
              }
          },
          handleItemToggle () {
              if (this.isFolder) {
                  this.model.opened = !this.model.opened
                  this.onItemToggle(this, this.model)
                  this.handleSetGroupMaxHeight()
              }
          },
          handleGroupMaxHeight () {
              let length = 0
              let childHeight = 0
              if (this.model.opened) {
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
                  this.handleRecursionNodeParents(self, node => {
                      if (node.$refs.group) {
                          node.$refs.group.style.maxHeight = node.handleGroupMaxHeight() + 'px'
                      }
                  })
              })
          },
          handleItemClick () {
              if (this.model.disabled) return
              this.model.selected = !this.model.selected
              this.onItemClick(this, this.model)
          },
          handleItemMouseOver () {
              this.isHover = true
          },
          handleItemMouseOut () {
              this.isHover = false
          },
          handleItemDrop (e, oriNode, oriItem) {
              this.$el.style.backgroundColor = "inherit"
              this.onItemDrop(e, oriNode, oriItem)
          }
      },
      created () {
          const self = this
          const events = {
              'click': this.handleItemClick,
              'mouseover': this.handleItemMouseOver,
              'mouseout': this.handleItemMouseOut
          }
          for (let itemEvent in this.itemEvents) {
              let itemEventCallback = this.itemEvents[itemEvent]
              if (events.hasOwnProperty(itemEvent)) {
                  let eventCallback = events[itemEvent]
                  events[itemEvent] = function (event) {
                      eventCallback(self, self.model, event)
                      itemEventCallback(self, self.model, event)
                  }
              } else {
                  events[itemEvent] = function (event) {
                      itemEventCallback(self, self.model, event)
                  }
              }
          }
          this.events = events
      },
      mounted () {
          this.handleSetGroupMaxHeight()
      }
  }
</script>
