<!--
 * @Description: 
 * @Author: lushevol
 * @Date: 2019-07-18 21:09:42
 * @LastEditors: lushevol
 * @LastEditTime: 2019-08-13 20:53:12
 -->
<template>
  <div id="D3-TopologicalGraph"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import D3Builder from './D3Builder.ts';
import './css/d3topo.min.css';

@Component
export default class D3TopologicalGraph extends Vue {
  @Prop({ required: true }) public readonly topoDataProp: any;
  public D3Builder = new D3Builder();
  public options = {
    d3TopoData: null,
    highlight: [
      {
        class: 'User',
        property: 'userId',
        value: 'eisman',
      },
    ],
    minCollision: 60,
    nodeRadius: 25,
    zoomFit: true,
    onGraphClick: () => {
      // console.log('click on graph');
      this.$emit('graphClick');
    },
    onNodeClick: (node: any) => {
      // console.log('click on node: ' + JSON.stringify(node));
      this.$emit('nodeClick', { node });
    },
    onNodeDoubleClick: (node: any) => {
        // console.log('double click on node: ' + JSON.stringify(node));
    },
    onRelationshipDoubleClick: (relationship: any) => {
        // console.log('double click on relationship: ' + JSON.stringify(relationship));
    },
  };
  public init() {
    this.initGraphData();
    this.D3Builder.init('#D3-TopologicalGraph', this.options);
  }
  public initGraphData() {
    this.options.d3TopoData = this.topoDataProp;
  }
}
</script>

<style lang="scss" scoped>
  #D3-TopologicalGraph {
    height: 100%;
    width: 100%;
  }
</style>
