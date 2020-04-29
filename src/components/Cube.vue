<template>
    <div :style="{ width: widthData, height: heightData }">
        <canvas id="canvas" />
    </div>
</template>

<script lang="ts">
import Scenario from '../cubes/Scenario'
// import Component from "vue-class-component";
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class Cube extends Vue {
    // scenario: Scenario = null;
    widthData = window.innerWidth * 0.8
    heightData = window.innerHeight * 0.8
    public mounted() {
        this.$nextTick(() => {
            // this.scenario = new Scenario("canvas");
            const canvas = document.getElementById(
                'canvas'
            ) as HTMLCanvasElement
            console.log(canvas)
            const scenario = new Scenario(
                canvas,
                this.widthData,
                this.heightData
            )
            window.addEventListener('resize', scenario.onWindowResize, false)
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
