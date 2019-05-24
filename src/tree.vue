<template>
    <div :class="classes" role="tree" onselectstart="return false">
        <ul :class="containerClasses" role="group">
            <tree-item v-for="(child, index) in data"
                       :key="index"
                       :data="child"
                       :text-field-name="textFieldName"
                       :value-field-name="valueFieldName"
                       :children-field-name="childrenFieldName"
                       :item-events="itemEvents"
                       :whole-row="wholeRow"
                       :show-checkbox="showCheckbox"
                       :allow-transition="allowTransition"
                       :height="sizeHeight"
                       :parent-item="data"
                       :draggable="draggable"
                       :drag-over-background-color="dragOverBackgroundColor"
                       :on-item-click="onItemClick"
                       :on-item-toggle="onItemToggle"
                       :on-item-drag-start="onItemDragStart"
                       :on-item-drag-end="onItemDragEnd"
                       :on-item-drop="onItemDrop"
                       :klass="index === data.length-1?'tree-last':''"
                       :expand-timer="expandTimer"
                       :expand-timer-time-out="expandTimerTimeOut"
                       :show-drop-position="showDropPosition"

            >
                <template slot-scope="_">
                    <slot :vm="_.vm" :model="_.model">
                        <i :class="_.vm.themeIconClasses" role="presentation" v-if="!_.model.loading"></i>
                        <span v-html="_.model[textFieldName]"></span>
                    </slot>
                </template>
            </tree-item>
        </ul>
    </div>
</template>
<script>
    import TreeItem from './tree-item.vue'

    let ITEM_ID = 0
    let ITEM_HEIGHT_SMALL = 18
    let ITEM_HEIGHT_DEFAULT = 24
    let ITEM_HEIGHT_LARGE = 32

    export default {
        name: 'VJstree',
        props: {
            data: {type: Array},
            size: {type: String, validator: value => ['large', 'small',''].indexOf(value) > -1},
            showCheckbox: {type: Boolean, default: false},
            wholeRow: {type: Boolean, default: false},
            noDots: {type: Boolean, default: false},
            collapse: {type: Boolean, default: false},
            multiple: {type: Boolean, default: false},
            allowBatch: {type: Boolean, default: false},
            allowTransition: {type: Boolean, default: true},
            textFieldName: {type: String, default: 'text'},
            valueFieldName: {type: String, default: 'value'},
            childrenFieldName: {type: String, default: 'children'},
            itemEvents: {
                type: Object, default: function () {
                    return {}
                }
            },
            async: {type: Function},
            loadingText: {type: String, default: 'Loading...'},
            draggable: {type: Boolean, default: false},
            dragOverBackgroundColor: {type: String, default: "#C9FDC9"},
            klass: String,

            expandTimer:{type: Boolean, default: false},
            expandTimerTimeOut:{type: Number, default: 1500},
            executeSiblingMovement:{type: Boolean, default:false},
            showDropPosition:{type: Boolean, default:true},
            multiTree: {type: Boolean, default: false},
            allowMultiTreeAndUsual: {type: Boolean, default: false},
        },
        data() {
            return {
                draggedItem: undefined,
                draggedElm: undefined
            }
        },
        computed: {
            classes() {
                return [
                    {'tree': true},
                    {'tree-default': !this.size},
                    {[`tree-default-${this.size}`]: !!this.size},
                    {'tree-checkbox-selection': !!this.showCheckbox},
                    {[this.klass]: !!this.klass}
                ]
            },
            containerClasses() {
                return [
                    {'tree-container-ul': true},
                    {'tree-children': true},
                    {'tree-wholerow-ul': !!this.wholeRow},
                    {'tree-no-dots': !!this.noDots}
                ]
            },
            sizeHeight() {
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
            initializeData(items) {
                if (items && items.length > 0) {
                    for (let i in items) {
                        var dataItem = this.initializeDataItem(items[i])
                        items[i] = dataItem
                        this.initializeData(items[i][this.childrenFieldName])
                    }
                }
            },
            initializeDataItem(item) {
                let self = this;
                function Model(item, textFieldName, valueFieldName, childrenFieldName, collapse) {
                    this.id = item.id || ITEM_ID++
                    this[textFieldName] = item[textFieldName] || ''
                    this[valueFieldName] = item[valueFieldName] || item[textFieldName]
                    this.icon = item.icon || ''
                    this.opened = item.opened || collapse
                    this.selected = item.selected || false
                    this.disabled = item.disabled || false
                    this.loading = item.loading || false
                    this[childrenFieldName] = self.initializeData(item[childrenFieldName]) || []
                }

                let node = Object.assign(new Model(item, this.textFieldName, this.valueFieldName, this.childrenFieldName, this.collapse), item)

                node.addBefore = function (data, selectedNode) {
                    let newItem = self.initializeDataItem(data)
                    let index = selectedNode.parentItem.findIndex(t => t.id === node.id)
                    selectedNode.parentItem.splice(index, 0, newItem)
                }
                node.addAfter = function (data, selectedNode) {
                    let newItem = self.initializeDataItem(data)
                    let index = selectedNode.parentItem.findIndex(t => t.id === node.id) + 1
                    selectedNode.parentItem.splice(index, 0, newItem)
                }
                node.addChild = function (data) {
                    let newItem = self.initializeDataItem(data)
                    node.opened = true
                    node[self.childrenFieldName].push(newItem)
                }
                node.openChildren = function () {
                    node.opened = true
                    self.handleRecursionNodeChildren(node, node => {
                        node.opened = true
                    })
                }
                node.closeChildren = function () {
                    node.opened = false
                    self.handleRecursionNodeChildren(node, node => {
                        node.opened = false
                    })
                }
                node.moveTo = function(draggedItem, anchorNode){

                    var swapItem = Object.assign({},draggedItem);
                    draggedItem.parentItem.splice(draggedItem.index, 1)
                    anchorNode.children = anchorNode.children ? anchorNode.children.concat(swapItem.item) : [swapItem.item]
                    anchorNode.opened = true


                }
                node.moveLeftTo = function(draggedItem, anchorNode, oriIndex){

                    draggedItem.parentItem.splice(draggedItem.index, 1)
                    anchorNode.parentItem.splice(oriIndex, 0, draggedItem.item);

                }
                node.moveRightTo = function(draggedItem, anchorNode, oriIndex){

                    draggedItem.parentItem.splice(draggedItem.index, 1)
                    anchorNode.parentItem.splice(oriIndex+1, 0, draggedItem.item);
                }
                node.deleteNode = function (selectedNode) {
                    let index = selectedNode.parentItem.findIndex(t => t.id === node.id)
                    selectedNode.parentItem.splice(index, 1)
                }
                return node
            },
            initializeLoading() {
                var item = {}
                item[this.textFieldName] = this.loadingText
                item.disabled = true
                item.loading = true
                return this.initializeDataItem(item)
            },
            handleRecursionNodeChilds(node, func) {
                if (func(node) !== false) {
                    if (node.$children && node.$children.length > 0) {
                        for (let childNode of node.$children) {
                            if (!childNode.disabled) {
                                this.handleRecursionNodeChilds(childNode, func)
                            }
                        }
                    }
                }
            },
            handleRecursionNodeChildren(node, func) {
                if (func(node) !== false) {
                    if (node[this.childrenFieldName] && node[this.childrenFieldName].length > 0) {
                        for (let childNode of node[this.childrenFieldName]) {
                            this.handleRecursionNodeChildren(childNode, func)
                        }
                    }
                }
            },
            onItemClick(oriNode, oriItem, e) {
                if (this.multiple) {
                    if (this.allowBatch) {
                        this.handleBatchSelectItems(oriNode, oriItem)
                    }
                } else {
                    this.handleSingleSelectItems(oriNode, oriItem)
                }
                this.$emit('item-click', oriNode, oriItem, e)
            },
            handleSingleSelectItems(oriNode, oriItem) {
                this.handleRecursionNodeChilds(this, node => {
                    if (node.model) node.model.selected = false
                })
                oriNode.model.selected = true
            },
            handleBatchSelectItems(oriNode, oriItem) {
                this.handleRecursionNodeChilds(oriNode, node => {
                    if (node.model.disabled) return
                    node.model.selected = oriNode.model.selected
                })
            },
            onItemToggle(oriNode, oriItem, e) {
                if (oriNode.model.opened) {
                    this.handleAsyncLoad(oriNode.model[this.childrenFieldName], oriNode, oriItem)
                }
                this.$emit('item-toggle', oriNode, oriItem, e)
            },
            handleAsyncLoad(oriParent, oriNode, oriItem) {
                var self = this
                if (this.async) {
                    this.async(oriNode, (data) => {
                        if (data.length > 0) {
                            for (let i in data) {
                                if (!data[i].isLeaf) {
                                    if (typeof data[i][self.childrenFieldName] !== "object") {
                                        data[i][self.childrenFieldName] = [self.initializeLoading()]
                                    }
                                }
                                var dataItem = self.initializeDataItem(data[i])
                                self.$set(oriParent, i, dataItem)
                            }
                        } else {
                            oriNode.model[self.childrenFieldName] = []
                        }
                        if(oriNode.model){
                            oriNode.model.loading = false;
                        }
                    })

                }
            },
            onItemDragStart(e, oriNode, oriItem) {

                if (!this.draggable || oriItem.dragDisabled)
                    return false
                if(this.multiTree){

                    this.draggedItem = {
                        item: oriItem,
                        parentItem: oriNode.parentItem,
                        index: oriNode.parentItem.findIndex(t => t.id === oriItem.id)
                    }
                }else{

                    e.dataTransfer.effectAllowed = "move"
                    e.dataTransfer.setData('text', "")
                    this.draggedElm = e.target
                    this.draggedItem = {
                        item: oriItem,
                        parentItem: oriNode.parentItem,
                        index: oriNode.parentItem.findIndex(t => t.id === oriItem.id)
                    }

                }
                this.$emit("item-drag-start", oriNode, oriItem,this.draggedItem, e)

            },
            onItemDragEnd(e, oriNode, oriItem) {
                this.draggedItem = undefined
                this.draggedElm = undefined
                this.$emit("item-drag-end", oriNode, oriItem, e)
            },
            allowedToDrop (oriItem, position) {
                if (!this.draggable || !this.draggedItem) {
                    return false
                }
                if (position === '2' && oriItem.canDrop === false) return false
                if (this.draggedItem.parentItem === oriItem.children ||
                    this.draggedItem.item === oriItem ||
                    (this.draggedItem.item.children && this.draggedItem.item.children.indexOf(oriItem) !== -1)) {
                    return false
                }
                return true
            },

            onItemDrop(e, oriNode, oriItem, position) {

                if (!this.draggable) return false
                if(this.multiTree && !this.allowMultiTreeAndUsual){
                    //for multiTree case - emit drop node, item, and event, emitting even on left/right drop position
                    this.$emit('item-drop-multi-tree', oriNode, oriItem, e);
                }
                else{
                    this.$emit('item-drop-multi-tree', oriNode, oriItem, e);

                    if (this.draggedItem && oriItem[this.childrenFieldName] !== this.draggedItem.item[this.childrenFieldName]) {

                        var newParent = ''
                        if (position === '2') {
                            /** Item is droped on the other item (folder) ****/
                            if (!this.allowedToDrop(oriItem, position)) return

                            if(this.executeSiblingMovement){
                                this.draggedItem.item.moveTo(this.draggedItem, oriItem);
                            }

                            this.$emit('item-drop', oriNode, oriItem, this.draggedItem, e)


                        }
                        else if (oriNode.parentItem) {
                            /** Item is droped before or under existing item ****/

                            if (oriNode.parentId) newParent = oriNode.parentId
                            // Find position of destination item in the parent group
                            var oriIndex = oriNode.parentItem.indexOf(oriItem)
                            var anchor_modificator = '';
                            if (position === '1') {
                                //before anchor node
                                if(this.executeSiblingMovement){
                                    this.draggedItem.item.moveLeftTo(this.draggedItem, oriNode, oriIndex)
                                }
                                anchor_modificator = "-left";
                            }
                            else if (position === '3') {
                                //after anchor node
                                if(this.executeSiblingMovement) {
                                    this.draggedItem.item.moveRightTo(this.draggedItem, oriNode, oriIndex);
                                }
                                anchor_modificator = "-right";

                            }

                            this.$emit('item-drop-sibling'+anchor_modificator, oriNode, oriItem, this.draggedItem, oriIndex,e)


                        }

                    }

                }

            }
        },
        created() {
            this.initializeData(this.data)
        },
        mounted() {
            if (this.async) {
                this.$set(this.data, 0, this.initializeLoading())
                this.handleAsyncLoad(this.data, this)
            }
        },
        components: {
            TreeItem
        }
    }
</script>
<style lang="less">
    @import "./less/style";
</style>