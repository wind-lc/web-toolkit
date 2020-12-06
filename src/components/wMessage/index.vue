<!--
/**
* @name wMessage
* @description **
* @author wind-lc
* @date 2020-12-06
* @param {Object} message 信息参数
* @param {Boolean} visible 可见
* @example <w-message :message="message"
               :visible.sync="messageVisible"></w-message>
*/
-->
<template>
  <div class="w-message-container"
       v-show="visible">
    <icon-svg type="icon-close"></icon-svg>
    <span>{{message.text}}</span>
  </div>
</template>
<script>
import IconSvg from '@/components/IconSvg'

export default {
  name: 'wMessage',
  components: {
    IconSvg
  },
  props: {
    message: {
      type: Object,
      require: true
    },
    visible: {
      type: Boolean,
      require: true
    }
  },
  data () {
    return {}
  },
  watch: {
    visible: {
      handler (newV, oldV) {
        if (newV) {
          this.$shell.beep()
          const timer = setTimeout(() => {
            this.$emit('update:visible', !newV)
            clearTimeout(timer)
          }, 2000)
        }
      }
    }
  },
  methods: {

  }
}
</script>
<style lang="scss">
.w-message-container {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  // display: flex;
  span {
    margin-left: 10px;
  }
}
</style>
