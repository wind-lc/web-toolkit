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
        <p>
          <i ref="straw"
             @mousedown="mousedown"
             @mouseup="mouseup">
            <icon-svg type="icon-straw"></icon-svg>
          </i>
          拖动吸管来获取颜色
        </p>
        <div>
          <ul>
            <li>
              <span>X,Y：</span>
              <input type="text">
            </li>
            <li>
              <span>HEX：</span>
              <input type="text">
            </li>
            <li>
              <span>RGB：</span>
              <input type="text">
            </li>
          </ul>
          <div class="color-straw-preview"></div>
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
const { remote } = window.require('electron')
export default {
  name: 'colorStraw',
  components: {
    IconSvg
  },
  data () {
    return {}
  },
  mounted () {
    this.createWin()
    this.ipcListener()
  },
  methods: {
    // 预创建取色窗口
    createWin () {
      const size = remote.screen.getPrimaryDisplay().size
      this.$ipcRenderer.send('create-color-straw-win', size)
    },
    // 主进程响应监听
    ipcListener () {
      // 屏幕取色回调
      this.$ipcRenderer.on('color-straw-return', (event, arg) => {
        if (arg.status === 'success') {
        } else {
          console.log(arg)
        }
      })
    },
    // 鼠标按下事件
    mousedown (e) {
      // 左键按下
      if (e.button === 0) {
        // const straw = this.$refs.straw
        // straw.addEventListener('mousemove', this.mousemove)
        const size = remote.screen.getPrimaryDisplay().size
        this.$ipcRenderer.send('color-straw', size)
      }
    },
    // 鼠标弹起事件
    mouseup (e) {
      const straw = this.$refs.straw
      straw.removeEventListener('mousemove', this.mousemove)
    },
    // 鼠标移动事件
    mousemove (e) {
      // console.log(e.clientX, e.clientY)
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
  width: 300px;
}
.color-straw-control {
  > p {
    font-size: 16px;
    margin-bottom: 20px;
    text-align: center;
    i {
      font-style: normal;
      display: inline-block;
      padding: 10px;
      margin-right: 20px;
    }
  }
  > div {
    display: flex;
    justify-content: space-between;
    ul {
      display: flex;
      justify-content: space-between;
      flex-flow: column;
      width: 150px;
      height: 100px;
      li {
        display: flex;
        align-items: center;
        span {
          letter-spacing: 2px;
          display: inline-block;
          width: 50px;
        }
        input {
          width: 100px;
          letter-spacing: 1px;
          text-align: center;
        }
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
