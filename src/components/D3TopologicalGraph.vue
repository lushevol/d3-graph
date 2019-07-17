<template>
  <div id="D3-TopologicalGraph"></div>
</template>

<script>
import D3TopoGraph from './D3TopoGraph'
import './css/d3topo.min.css'

export default {
  name: 'D3TopologicalGraph',
  data() {
    return {
      D3TopoGraph: new D3TopoGraph(),
      options: {
        highlight: [
          {
            class: 'User',
            property: 'userId',
            value: 'eisman'
          }
        ],
        minCollision: 60,
        nodeRadius: 25,
        zoomFit: true,
        onGraphClick: () => {
          console.log('click on graph');
          this.$emit('graphClick')
        },
        onNodeClick: (node) => {
          console.log('click on node: ' + JSON.stringify(node));
          this.$emit('nodeClick', { node })
        },
        onNodeDoubleClick: (node) => {
            console.log('double click on node: ' + JSON.stringify(node));
        },
        onRelationshipDoubleClick: (relationship) => {
            console.log('double click on relationship: ' + JSON.stringify(relationship));
        }
      }
    }
  },
  props: {
    topoDataProp: {
      required: true
    }
  },
  methods: {
    init() {
      this.initGraphData()
      this.D3TopoGraph.init('#D3-TopologicalGraph', this.options)
    },
    initGraphData() {
      this.options.d3TopoData = this.topoDataProp
    },
    initPageData() {

    },
    initPage() {
      this.initPageData()
    },
  },
  mounted() {
    this.initPage()
  }
}
</script>

<style lang="scss" scoped>
  #D3-TopologicalGraph {
    height: 100%;
    width: 100%;
  }
</style>
