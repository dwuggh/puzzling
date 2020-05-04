<template>
    <canvas id="canvas" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Scenario } from '../cubes/Scenario'
import { RubiksCube } from '../cubes/RubiksCube'
import { Order } from '../cubes/Order'
import { KeyMap } from '../cubes/KeyMap'

@Component
export default class Cube extends Vue {
  rubiksCube = new RubiksCube(3)
  keyMap = new KeyMap()

  public onKeydown(event: KeyboardEvent) {
    console.log(event.code)
    this.keyMap.listen(event.code, this.rubiksCube)
  }

  public mounted() {
    this.$nextTick(() => {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement
      const scenario = new Scenario(canvas, this.rubiksCube)

      console.log(new Order('3B'))
      // console.log(new Order('L'))
      // this.rubiksCube.orderQueue.unshift(new Order('L'))
      // this.rubiksCube.orderQueue.unshift(new Order('3B'))
      scenario.animate()
      window.addEventListener('keydown', this.onKeydown)
    })
  }
}
</script>

<style scoped></style>
