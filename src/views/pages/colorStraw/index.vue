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
             @click="openColorStraw">
            <icon-svg type="icon-straw"></icon-svg>
          </i>
          点击吸管来获取颜色
        </p>
        <div>
          <ul>
            <li>
              <span>X,Y：</span>
              <input type="text"
                     :value="colorStraw.cursor.x+','+colorStraw.cursor.y"
                     readonly>
            </li>
            <li>
              <span>HEX：</span>
              <input type="text"
                     :value="colorStraw.hex"
                     readonly>
            </li>
            <li>
              <span>RGB：</span>
              <input type="text"
                     :value="colorStraw.rgb"
                     readonly>
            </li>
          </ul>
          <div class="color-straw-preview"
               :style="{'background-color':colorStraw.hex}"></div>
        </div>
      </div>
      <!-- 取色控件 -->
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
    return {
      // 进程通信状态
      ipcStatus: 'success',
      // 屏幕size
      size: {},
      // 取色数据
      colorStraw: {
        cursor: {
          x: 0,
          y: 0
        },
        hex: '',
        rgb: ''
      }
    }
  },
  created () {
    this.colorStraw = this.$eStore.get('colorStraw')
    this.ipcListener()
    this.createWin()
  },
  methods: {
    // 预创建取色窗口
    createWin () {
      this.size = remote.screen.getPrimaryDisplay().size
      this.$ipcRenderer.send('create-color-straw-win', this.size)
    },
    // 主进程响应监听
    ipcListener () {
      // 窗口创建成功回调
      this.$ipcRenderer.on('create-color-straw-win-return', (event, { status, msg, data }) => {
      })
      // 取色窗口关闭回调
      this.$ipcRenderer.on('close-color-straw-win-return', (event, { status, msg, data }) => {
        this.colorStraw = this.$eStore.get('colorStraw')
      })
    },
    // 打开取色窗口
    openColorStraw (e) {
      const { size: { width, height }, scaleFactor } = remote.screen.getPrimaryDisplay()
      desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
          width: width * scaleFactor,
          height: height * scaleFactor
        }
      }).then(sources => {
        const imgSrc = sources[0].thumbnail.toDataURL()
        this.src = imgSrc
        this.$ipcRenderer.send('color-straw', imgSrc)
      }).catch(error => {
        console.log(error)
      })
    }
  },
  beforeDestroy () {
    // 移除与主进程的通信
    this.$ipcRenderer.removeAllListeners()
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
</style>
