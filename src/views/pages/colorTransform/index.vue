<!--
/**
* @description **
* @author wind-lc
* @date 2020-12-03
*/
-->
<template>
  <div class="color-transform-container page">
    <ul class="color-transform-form">
      <li class="color-transform-rgb">
        <span>RGB：</span>
        <input type="text"
               v-model="rgb"
               maxlength="11"
               @keyup.enter="transformHex()">
      </li>
      <li>
        <i @click="transformHex()">
          <icon-svg type="icon-arrows"></icon-svg>
        </i>
        <i @click="transformRgb()">
          <icon-svg type="icon-arrows"></icon-svg>
        </i>
      </li>
      <li class="color-transform-hex">
        <span>HEX：</span>
        <input type="text"
               v-model="hex"
               @keyup.enter="transformRgb()">
      </li>
    </ul>
    <div class="color-transform-preview"
         :style="{'background-color':background}"></div>
    <w-message :message="message"
               :visible.sync="messageVisible"></w-message>
  </div>
</template>
<script>
import IconSvg from '@/components/IconSvg'
import wMessage from '@/components/wMessage'
export default {
  name: 'colorTransform',
  components: {
    IconSvg,
    wMessage
  },
  data () {
    return {
      // rgb值
      rgb: '',
      // 十六进制值
      hex: '',
      // 预览颜色
      background: '',
      // 提示信息
      message: {
        type: '',
        text: ''
      },
      // 提示信息可见
      messageVisible: false
    }
  },
  methods: {
    // 转换为十六进制
    transformHex () {
      const reg = /^(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))),(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))),(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/
      let arr = this.rgb.split(',')
      if (reg.test(arr)) {
        arr = arr.map(el => {
          let s = Number(el).toString(16).toUpperCase()
          if (s.length === 1) {
            s = '0' + s
          }
          return s
        })
        let hex = '#'
        arr.forEach(el => { hex += el })
        this.hex = hex
        this.background = hex
      } else {
        this.message = {
          type: 'error',
          text: '请输入正确的RGB值'
        }
        this.messageVisible = true
      }
    },
    // 转换为RGB
    transformRgb () {
      const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
      if (reg.test(this.hex)) {
        const hex = this.hex.substring(1)
        const rgb = []
        for (var i = 0; i < hex.length; i += 2) {
          rgb.push(parseInt('0x' + hex.slice(i, i + 2)))
        }
        this.rgb = rgb.join()
        this.background = this.hex
      } else {
        this.message = {
          type: 'error',
          text: '请输入正确的十六进制值'
        }
        this.messageVisible = true
      }
    }
  }
}
</script>
<style lang="scss">
.color-transform-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.color-transform-form {
  height: 100px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-between;
  li {
    display: flex;
    align-items: center;
    span {
      letter-spacing: 2px;
    }
    input {
      width: 100px;
      letter-spacing: 1px;
      text-align: center;
    }
    > i {
      .icon-svg {
        font-size: 18px;
        margin: 0 10px;
        cursor: pointer;
      }
      &:first-of-type .icon-svg {
        transform: rotate(-90deg);
      }
      &:last-of-type .icon-svg {
        transform: rotate(90deg);
      }
    }
  }
}
.color-transform-preview {
  width: 100px;
  height: 100px;
  margin-left: 20px;
}
</style>
