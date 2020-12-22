<!--
/**
* @description 屏幕取色器
* @author wind-lc
* @date 2020-12-21
*/
-->
<template>
  <div class="page color-straw">
    <div class="color-straw-content">
      <!-- 取色控件 -->
      <div class="color-straw-control">
        <p>拖动吸管来获取颜色</p>
        <div>
          <ul>
            <li>
              <i ref="straw"
                 @mousedown="mousedown"
                 @mouseup="mouseup">
                <icon-svg type="icon-straw"></icon-svg>
              </i>
              <input type="text">
            </li>
            <li>
              <span>HEX</span>
              <input type="text">
            </li>
            <li>
              <span>RGB</span>
              <input type="text">
            </li>
          </ul>
          <div class="color-straw-preview">111</div>
        </div>
      </div>
      <!-- 取色控件 -->
      <!-- 隐藏 -->
      <video ref="video"
             src=""
             class="video"></video>
      <canvas ref="canvas"
              class="canvas"></canvas>
      <!-- 隐藏 -->
    </div>
  </div>
</template>
<script>
import IconSvg from '@/components/IconSvg'
const { desktopCapturer, remote } = window.require('electron')
export default {
  name: 'colorStraw',
  components: {
    IconSvg
  },
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
          const img = ctx.getImageData(0, 0, 1, 1)
          console.log(img.data)
          stream.getTracks()[0].stop() // 关闭视频流，序号是反向的，此处只有一个所以是0
        })
      }
    },
    // 鼠标按下事件
    mousedown (e) {
      // 左键按下
      if (e.button === 0) {
        const straw = this.$refs.straw
        straw.addEventListener('mousemove', this.mousemove)
      }
    },
    // 鼠标弹起事件
    mouseup (e) {
      const straw = this.$refs.straw
      straw.removeEventListener('mousemove', this.mousemove)
    },
    // 鼠标移动事件
    mousemove (e) {
      console.log(e.clientX, e.clientY)
    }
  }
}
</script>
<style lang="scss">
.color-straw {
  display: flex;
  justify-content: center;
  align-items: center;
}
.color-straw-content {
  width: 400px;
}
.color-straw-control {
  > p {
    font-size: 16px;
    margin-bottom: 20px;
    text-align: center;
  }
  > div {
    display: flex;
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
    }
    .color-straw-preview {
      width: 100px;
      height: 100px;
    }
  }
}
.video {
  display: none;
}
.canvas {
  display: none;
}
</style>
