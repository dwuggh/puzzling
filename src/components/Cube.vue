<template>
  <div :style="{ width: widthData, height: heightData }">
    <canvas id="canvas" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

import { Scenario } from '../cubes/Scenario'
import { RubiksCube } from '../cubes/RubiksCube'
import { Order } from '../cubes/Order'

@Component
export default class Cube extends Vue {

  widthData = window.innerWidth * 0.8
  heightData = window.innerHeight * 0.8
  public mounted() {
    this.$nextTick(() => {

      const canvas = document.getElementById('canvas') as HTMLCanvasElement
      const rubiksCube = new RubiksCube(3)
      const scenario = new Scenario(canvas, rubiksCube)

      rubiksCube.orderQueue.unshift(new Order('R', 3))
      rubiksCube.orderQueue.unshift(new Order('B', 3))
      scenario.animate()
    })
  }
}
</script>

<style scoped>
</style>
