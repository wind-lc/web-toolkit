<!--
/**
* @description layout
* @author wind-lc
* @date 2020-12-02
*/
-->
<template>
  <div class="toolkit-layout"
       :class="getUi.skin">
    <!-- 标题栏 -->
    <div class="toolkit-titlebar">
      <!-- logo -->
      <div class="toolkit-logo">
        <router-link :to="{name: 'dashboard'}">
          <icon-svg type="icon-logo"></icon-svg>
          <h1>WebToolkit</h1>
        </router-link>
      </div>
      <!-- logo -->
      <!-- 控制按钮 -->
      <ul class="toolkit-controls">
        <!-- 菜单 -->
        <li title="帮助"
            @click="helpVisible = !helpVisible"
            v-clickoutside="handleHelpVisible"
            :class="{'toolkit-controls-list-active':helpVisible}">
          <icon-svg type="icon-help"></icon-svg>
          <ul v-show="helpVisible"
              class="toolkit-controls-help-list toolkit-controls-select">
            <li v-for="({name,value,click}) in help"
                :key="value"
                @click="menubarClick(click)"
                title="">{{name}}</li>
          </ul>
        </li>
        <li title="皮肤"
            @click="skinVisible = !skinVisible"
            v-clickoutside="handleSkinVisible">
          <icon-svg type="icon-skin"></icon-svg>
          <ul v-show="skinVisible"
              class="toolkit-controls-skin-list toolkit-controls-select">
            <li v-for="({name,value,color}) in skin"
                :key="value"
                :style="{'background-color': color}"
                title=""
                @click="handleSkin(value)">
              <icon-svg type="icon-logo"></icon-svg>
              <span>{{name}}</span>
            </li>
          </ul>
        </li>
        <li title="设置">
          <icon-svg type="icon-setting"></icon-svg>

        </li>
        <!-- 菜单 -->
        <!-- 窗口控制 -->
        <li v-for="({name,icon,value,show}) in windowControlsList"
            :key="value"
            :title="name"
            @click="controlWindow(value)"
            v-show="show">
          <icon-svg :type="icon"></icon-svg>
        </li>
        <!-- 窗口控制 -->
      </ul>
      <!-- 控制按钮 -->
    </div>
    <!-- 标题栏 -->
    <!-- 内容主体 -->
    <main class="toolkit-main">
      <router-view />
    </main>
    <!-- 内容主体 -->
  </div>
</template>
<script>
import IconSvg from '@/components/IconSvg'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'layout',
  components: {
    IconSvg
  },
  data () {
    return {
      // 进程通信状态
      ipcStatus: 'success',
      // 帮助菜单可见
      helpVisible: false,
      // 帮助菜单
      help: [
        {
          name: '切换开发人员工具',
          value: 'devTools',
          click: 'showDevTools'
        },
        {
          name: '帮助文档',
          value: 'document',
          click: 'showDocument'
        }
      ],
      // 皮肤菜单可见
      skinVisible: false,
      // 皮肤菜单
      skin: [
        {
          name: '夜幕黑',
          color: '#3c3c3c',
          value: 'night-theme'
        },
        {
          name: '拂晓蓝',
          color: '#1890ff',
          value: 'dawn-theme'
        },
        {
          name: '薄暮红',
          color: '#f5222d',
          value: 'dusk-theme'
        }
      ],
      // 窗口控制按钮
      windowControlsList: [
        {
          name: '最小化',
          icon: 'icon-minimization',
          value: 'minimize',
          show: true
        },
        {
          name: '最大化',
          icon: 'icon-maximization',
          value: 'maximize',
          show: true
        },
        {
          name: '还原',
          icon: 'icon-windowed',
          value: 'unmaximize',
          show: false
        },
        {
          name: '关闭',
          icon: 'icon-close',
          value: 'close',
          show: true
        }

      ]
    }
  },
  directives: {
    clickoutside: {
      bind (el, binding, vnode) {
        function documentHandler (e) {
          if (el.contains(e.target)) {
            return false
          }
          if (typeof binding.value === 'function') {
            binding.value(e)
          } else {
            console.error('您传入的值并不是一个函数：' + binding.value)
          }
        }
        el.__vueClickOutSize__ = documentHandler
        document.addEventListener('click', documentHandler)
      },
      unbind (el, binding) {
        document.removeEventListener('click', el.__vueClickOutSize__)
        delete el.__vueClickOutSize__
      }
    }
  },
  computed: {
    ...mapGetters(['getUi'])
  },
  mounted () {
    this.isMaximized()
    this.ipcListener()
  },
  methods: {
    ...mapActions(['saveUi']),
    // 主进程响应监听
    ipcListener () {
      // 控制台
      this.$ipcRenderer.on('show-dev-tools-console', (event, arg) => {
        console.log(arg)
      })
      // 返回窗口是否全屏
      this.$ipcRenderer.on('control-window-return', (event, arg) => {
        if (arg) {
          this.windowControlsList[1].show = false
          this.windowControlsList[2].show = true
        } else {
          this.windowControlsList[1].show = true
          this.windowControlsList[2].show = false
        }
      })
      // 窗口最大化事件
      this.$ipcRenderer.on('wind-maximize', (event, { status, data }) => {
        if (status === this.ipcStatus) {
          if (data.max) {
            this.windowControlsList[1].show = false
            this.windowControlsList[2].show = true
          } else {
            this.windowControlsList[1].show = true
            this.windowControlsList[2].show = false
          }
        }
      })
    },
    // 隐藏帮助
    handleHelpVisible () {
      this.helpVisible = false
    },
    // 隐藏皮肤
    handleSkinVisible () {
      this.skinVisible = false
    },
    // 皮肤选择
    handleSkin (value) {
      this.saveUi({
        skin: value
      })
    },
    // 显示控制台
    showDevTools () {
      this.$ipcRenderer.send('show-dev-tools', true)
    },
    // 显示帮助文档
    showDocument () {
      this.$router.push({ name: 'helpDocument' })
    },
    // 菜单按钮点击事件
    menubarClick (fun) {
      if (fun) {
        this[fun]()
      }
    },
    // 窗口控制
    controlWindow (value) {
      this.$ipcRenderer.send('control-window', value)
    },
    // 返回窗口是否全屏
    isMaximized () {
      this.$ipcRenderer.send('is-maximized', '')
    },
    // 应用控制
    controlToolkit (value) {
      this.showDevTools()
    }
  }
}
</script>
<style lang="scss">
.toolkit-layout {
  height: 100%;
}
.toolkit-titlebar {
  height: 50px;
  -webkit-app-region: drag;
  display: flex;
  position: relative;
  user-select: none;
  &::before {
    content: '';
    display: block;
    height: 2px;
    width: 100%;
    position: absolute;
    background: transparent;
    top: 0;
    left: 0;
    -webkit-app-region: no-drag;
  }
}
.toolkit-logo {
  padding: 0 12px;
  > a {
    display: flex;
    height: 100%;
    align-items: center;
    -webkit-app-region: no-drag;
  }
  .icon-svg {
    font-size: 24px;
  }
  h1 {
    font-weight: normal;
    margin-left: 12px;
  }
}
.toolkit-controls {
  margin-left: auto;
  display: flex;
  -webkit-app-region: no-drag;
  & > li {
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    transition: all 0.5s ease;
  }
}
.toolkit-controls-select {
  position: absolute;
  top: 50px;
  left: 0;
  z-index: 1;
  width: 200px;
}
.toolkit-controls-help-list {
  & > li {
    height: 30px;
    line-height: 30px;
    padding: 0 14px;
  }
}
.toolkit-controls-skin-list {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  width: 230px;
  & > li {
    width: 50px;
    height: 50px;
    margin: 10px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    padding-bottom: 5px;
    position: relative;
    &::before {
      content: '';
      display: block;
      position: absolute;
      top: -3px;
      left: -3px;
      width: calc(100% + 4px);
      height: calc(100% + 4px);
      transition: all 0.5s ease;
    }
    .icon-svg {
      font-size: 24px;
    }
    span {
      position: absolute;
      text-align: center;
      font-size: 9px;
      width: 100%;
      bottom: 5px;
      left: 0;
    }
  }
}
.toolkit-main {
  height: calc(100% - 50px);
}
</style>
