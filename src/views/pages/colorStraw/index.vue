<!--
/**
* @description 屏幕取色器
* @author wind-lc
* @date 2020-12-21
*/
-->
<template>
  <div class="page">
    <video src=""
           class="video"></video>
    <canvas id="canvas"></canvas>
    <button @click="getDesktop">btn</button>
  </div>
</template>
<script>
const { desktopCapturer, remote } = window.require('electron')
export default {
  name: 'colorStraw',
  components: {},
  data () {
    return {}
  },
  methods: {
    // 捕获屏幕
    getDesktop () {
      const size = remote.screen.getPrimaryDisplay().size
      const { x, y } = remote.screen.getCursorScreenPoint()
      console.log(x, y)
      desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
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
      const video = document.querySelector('video')
      video.srcObject = stream
      video.onloadedmetadata = () => {
        video.play()
        const cas = document.getElementById('canvas')
        const ctx = cas.getContext('2d')
        cas.width = size.width
        cas.height = size.height
        cas.style.width = size.width + 'px'
        cas.style.height = size.height + 'px'
        // ctx.drawImage(video,0, 0)
        ctx.clearRect(0, 0, size.width, size.height)
        createImageBitmap(video).then(bmp => { // 转为bitmap，可以提高性能，降低canvas渲染延迟
          ctx.drawImage(bmp, 0, 0)
          const img = ctx.getImageData(0, 0, 1, 1)
          console.log(img.data)
          stream.getTracks()[0].stop() // 关闭视频流，序号是反向的，此处只有一个所以是0
        })
      }
    }
  }
}
</script>
<style lang="scss">
.video {
  display: none;
}
#canvas {
  display: none;
}
</style>
