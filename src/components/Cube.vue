<template>
  <div :style="{ width: widthData, height: heightData }">
    <canvas id="canvas" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

import { Scenario } from '../cubes/Scenario'
import { RubiksCube } from '../cubes/RubiksCube'
import { Order } from '../cubes/order'
@Component
export default class Cube extends Vue {
  // scenario: Scenario = null;
  widthData = window.innerWidth * 0.8
  heightData = window.innerHeight * 0.8
  public mounted() {
    this.$nextTick(() => {
      // this.scenario = new Scenario("canvas");
      const canvas = document.getElementById('canvas') as HTMLCanvasElement
      const rubiksCube = new RubiksCube(3)
      const scenario = new Scenario(canvas, rubiksCube)

      rubiksCube.orderSet.unshift(new Order('R', [1,2], 3))
      rubiksCube.orderSet.unshift(new Order('B', [1,2], 3))
      scenario.animate()
    })
  }
}
</script>

<style scoped>
/* .cube #canvas {
    height: 80%;
    width: 100%;
    } */
</style>
