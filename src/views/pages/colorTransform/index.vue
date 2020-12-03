<!--
/**
* @description **
* @author wind-lc
* @date 2020-12-03
*/
-->
<template>
  <div class="color-transform-container page">
    <div class="color-transform-preview"></div>
    <div class="color-transform-rgb">
      <span>RGB:</span>
      <input type="text">
    </div>
    <div class="color-transform-hex">
      <span>十六进制:</span>
      <input type="text">
    </div>
  </div>
</template>
<script>
export default {
  name: 'colorTransform',
  components: {},
  data () {
    return {}
  }
}
</script>
<style lang="scss">
.color-transform-container {
  display: flex;
}
.color-transform-preview {
  width: 100px;
  height: 100px;
}
</style>
