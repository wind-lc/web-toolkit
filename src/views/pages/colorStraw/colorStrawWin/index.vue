<!--
/**
* @description 屏幕取色器取色窗口
* @author wind-lc
* @date 2020-12-23
*/
-->
<template>
  <div class="color-straw-win"
       @mousemove="getCoordinate">
    <button @click="close">关闭</button>
  </div>
</template>
<script>
const { desktopCapturer, remote } = window.require('electron')
export default {
  name: 'colorStrawWin',
  components: {},
  data () {
    return {
      // canvas画布2d对象
      ctx: null
    }
  },
  mounted () {
    this.ipcListener()
  },
  methods: {
    // 主进程响应监听
    ipcListener () {
      // 屏幕取色回调
      this.$ipcRenderer.on('color-straw-return', (event, arg) => {
        if (arg.status === 'success') {
          if (arg.data.visible) {
            console.log('112')
            this.getDesktop()
          }
        } else {
          console.log(arg)
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
      // const img = this.ctx.getImageData(e.clientX, e.clientY, 1, 1)
      // console.log(img.data)
    },
    // 捕获屏幕
    getDesktop () {
      const size = remote.screen.getPrimaryDisplay().size
      const { x, y } = remote.screen.getCursorScreenPoint()
      console.log(x, y)
      desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
        console.log(sources)
        await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sources[0].id,
              minWidth: size.width,
              maxWidth: size.width,
              minHeight: size.height,
              maxHeight: size.height
            }
          }
        }).then(res => {
          this.handleStream(res, size)
        }).catch(error => {
          console.log(error)
        })
      }).catch(error => {
        console.log(error)
      })
    },
    // 视频流处理
    handleStream (stream, size) {
      const video = this.$refs.video
      video.srcObject = stream
      video.onloadedmetadata = () => {
        video.play()
        const cas = this.$refs.canvas
        const ctx = cas.getContext('2d')
        cas.width = size.width
        cas.height = size.height
        cas.style.width = size.width + 'px'
        cas.style.height = size.height + 'px'
        // ctx.drawImage(video,0, 0)
        ctx.clearRect(0, 0, size.width, size.height)
        createImageBitmap(video).then(bmp => { // 转为bitmap，可以提高性能，降低canvas渲染延迟
          ctx.drawImage(bmp, 0, 0)
          this.ctx = ctx
          stream.getTracks()[0].stop() // 关闭视频流，序号是反向的，此处只有一个所以是0
        })
      }
    }
  }
}
</script>
<style lang="scss">
.color-straw-win {
  height: 100%;
}
</style>
