<template>
  <div>
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
    this.scenario = new Scenario();
  }
}
</script>
