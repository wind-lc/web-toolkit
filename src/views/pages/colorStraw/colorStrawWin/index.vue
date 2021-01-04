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
    <i class="straw"
       :style="{left:x+'px',top:y+'px'}">
      <icon-svg type="icon-straw"></icon-svg>
    </i>
    <canvas ref="canvas"
            class="canvas"></canvas>
    <button class="close-btn"
            @click="close"
            :style="{'color':rgb}">关闭 {{rgb}}</button>
  </div>
</template>
<script>
// import IconSvg from '@/components/IconSvg'
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
      rgb: '',
      x: 0,
      y: 0,
      src: null,
      // 屏幕size
      size: {}
    }
  },
  created () {
    // this.ipcListener()
    this.size = remote.screen.getPrimaryDisplay().size
    this.getDesktop()
  },
  methods: {
    // 主进程响应监听
    ipcListener () {
      this.$ipcRenderer.on('screen-shot-url-return', (event, { status, msg, data }) => {
        if (status === this.ipcStatus) {
          // 获取到临时文件路径
          this.url = data.url
          this.size = remote.screen.getPrimaryDisplay().size
          // this.getColot()
          this.getDesktop()
        }
      })
    },
    // 关闭
    close () {
      this.$ipcRenderer.send('close-color-straw-win', true)
    },
    // 获取坐标
    getCoordinate (e) {
      // console.log(this.ctx)

      // this.getDesktop(e.clientX, e.clientY)
      // const img = this.ctx.getImageData(e.clientX, e.clientY, 1, 1)

      if (this.ctx) {
        const img = this.ctx.getImageData(e.clientX * 2, e.clientY * 2, 1, 1)
        this.x = e.clientX
        this.y = e.clientY
        this.rgb = `rgb(${img.data[0]},${img.data[1]},${img.data[2]})`
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
        const ratio = devicePixelRatio
        cas.width = this.size.width * ratio
        cas.height = this.size.height * ratio
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
  color: #ffffff;
  position: relative;
  overflow: hidden;
}
.video {
  display: none;
}
.div {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 0;
  right: 0;
  border: 2px solid red;
  color: red;
}
.straw {
  position: absolute;
  color: red;
  border: 2px solid red;
}
.canvas {
  width: 100%;
  height: 100%;
}
.close-btn {
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
}
.canvas1 {
  width: 2px;
  height: 2px;
  position: absolute;
  top: 0;
  right: 0;
  border: 1px solid red;
}
</style>
