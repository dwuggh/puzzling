<template>
  <div class="cube">
    <canvas id="canvas" />
  </div>
</template>

<script lang="ts">
import Scenario from "../cubes/Scenario";
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Cube extends Vue {
  private scenario: Scenario;
  mounted() {
    this.scenario = new Scenario("canvas");
  }
}
</script>

<style scoped>
 /* .cube #canvas {
    height: 80%;
    width: 100%;
    } */
</style>
