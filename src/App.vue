<template>
  <div class="d3-graph">
    <D3TopologicalGraph />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import D3TopologicalGraph from './components/D3TopologicalGraph';

@Component({
  components: {
    D3TopologicalGraph,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
