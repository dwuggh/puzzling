<template>
  <div class="index">
    <cube id="cube" />
  </div>
</template>

<script>
import Cube from "@/components/Cube";
export default {
  name: "Index",
  components: {
    Cube,
  },
};
</script>

<style scoped>
.index {
  height: 300px;
  width: 100%;
}
</style>
