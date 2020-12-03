<!--
/**
* @description layout
* @author wind-lc
* @date 2020-12-02
*/
-->
<template>
  <div class="toolkit-layout">
    <!-- 标题栏 -->
    <div class="toolkit-titlebar">
      <!-- logo -->
      <div class="toolkit-logo">
        <router-link :to="{name: 'dashboard'}">
          <img src="/favicon.ico"
               alt="">
        </router-link>
        <h1>WebToolkit</h1>
      </div>
      <!-- logo -->
      <!-- 控制按钮 -->
      <ul class="toolkit-controls">
        <!-- 菜单 -->
        <li v-for="({name,icon,value,show}) in menubar"
            :key="value"
            :title="name"
            @click="controlToolkit(value)"
            v-show="show">
          <icon-svg :type="icon"></icon-svg>
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
export default {
  name: 'layout',
  components: {
    IconSvg
  },
  data () {
    return {
      // 菜单按钮
      menubar: [
        {
          name: '帮助',
          icon: 'icon-help',
          value: 'help',
          show: true
        },
        {
          name: '设置',
          icon: 'icon-setting',
          value: 'setting',
          show: true
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
  mounted () {
    this.isMaximized()
  },
  methods: {
    // 显示控制台
    showDevTools () {
      this.$ipcRenderer.send('show-dev-tools', true)
      this.$ipcRenderer.on('show-dev-tools-console', (event, arg) => {
        console.log(arg)
      })
    },
    // 窗口控制
    controlWindow (value) {
      this.$ipcRenderer.send('control-window', value)
    },
    // 返回窗口是否全屏
    isMaximized () {
      this.$ipcRenderer.send('is-maximized', '')
      this.$ipcRenderer.on('control-window-return', (event, arg) => {
        if (arg) {
          this.windowControlsList[1].show = false
          this.windowControlsList[2].show = true
        } else {
          this.windowControlsList[1].show = true
          this.windowControlsList[2].show = false
        }
      })
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
  display: flex;
  padding: 0 12px;
  align-items: center;
  > a {
    -webkit-app-region: no-drag;
  }
  img {
    width: 22px;
    height: 22px;
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
  li {
    padding: 0 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
.toolkit-main {
  height: calc(100% - 50px);
}
</style>
