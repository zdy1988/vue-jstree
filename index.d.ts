import Vue, { Component } from 'vue'

export default class VJstree extends Vue {

}

export class TreeItem extends Vue {}

export interface TreeDataItem {
    text: string;
    value?: string;
    children?: TreeDataItem[];
    icon?: string;
    opened?: boolean;
    selected?: boolean;
    disabled?: boolean;
    loading?: boolean;
    isLeaf?: boolean;
    dragDisabled?: boolean;
    dropDisabled?: boolean;
}
