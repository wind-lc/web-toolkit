<!--
/**
* @description 屏幕取色器取色窗口
* @author wind-lc
* @date 2020-12-23
*/
-->
<template>
  <div class="color-straw-win"
       @mousemove="getCoordinate"
       @click="close">
    <canvas ref="canvas"
            class="canvas"></canvas>
  </div>
</template>
<script>
// import IconSvg from '@/components/IconSvg'
import { mapActions } from 'vuex'
const { desktopCapturer, remote } = window.require('electron')
export default {
  name: 'colorStrawWin',
  components: {
    // IconSvg
  },
  data () {
    return {
      // 进程通信状态
      ipcStatus: 'success',
      // canvas画布2d对象
      ctx: null,
      // 屏幕倍数
      ratio: devicePixelRatio,
      // 鼠标位置
      x: 0,
      y: 0,
      // 取色数据
      colorStraw: {
        cursor: {
          x: 0,
          y: 0
        },
        hex: '',
        rgb: ''
      },
      // 屏幕size
      size: {}
    }
  },
  created () {
    this.size = remote.screen.getPrimaryDisplay().size
    this.getDesktop()
  },
  methods: {
    ...mapActions(['saveRgb']),
    // 关闭
    close () {
      this.$eStore.set('colorStraw', this.colorStraw)
      this.$ipcRenderer.send('close-color-straw-win', true)
    },
    // 获取坐标
    getCoordinate (e) {
      if (this.ctx) {
        this.x = e.clientX
        this.y = e.clientY
        const x = e.clientX * this.ratio
        const y = e.clientY * this.ratio
        const img = this.ctx.getImageData(x, y, 1, 1)
        let hexArr = [img.data[0], img.data[1], img.data[2]]
        hexArr = hexArr.map(el => {
          let s = el.toString(16).toUpperCase()
          if (s.length === 1) {
            s = '0' + s
          }
          return s
        })
        let hex = '#'
        hexArr.forEach(el => { hex += el })
        this.colorStraw.cursor.x = x
        this.colorStraw.cursor.y = y
        this.colorStraw.hex = hex
        this.colorStraw.rgb = `${img.data[0]}, ${img.data[1]}, ${img.data[2]}`
      }
    },
    // 捕获屏幕
    getDesktop (screenX, screenY) {
      const { size: { width, height }, scaleFactor } = remote.screen.getPrimaryDisplay()
      desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
          width: width * scaleFactor,
          height: height * scaleFactor
        }
      }).then(sources => {
        const imgSrc = sources[0].thumbnail.toDataURL()
        const cas = this.$refs.canvas
        this.ctx = cas.getContext('2d')
        cas.width = this.size.width * this.ratio
        cas.height = this.size.height * this.ratio
        cas.style.width = 1920 + 'px'
        cas.style.height = 1080 + 'px'
        const image = new Image()
        image.src = imgSrc
        image.onload = () => {
          this.ctx.clearRect(0, 0, this.size.width, this.size.height)
          this.ctx.drawImage(image, 0, 0)
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
<style lang="scss">
.color-straw-win {
  height: 100%;
  overflow: auto;
  position: relative;
  overflow: hidden;
  background-color: transparent;
  .canvas {
    width: 100%;
    height: 100%;
    cursor: url('~@/assets/img/straw.png') 2 18, auto;
  }
  .video {
    display: none;
  }
}
</style>
