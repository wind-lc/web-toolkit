<!--
/**
* @description **
* @author wind-lc
* @date 2020-12-03
*/
-->
<template>
  <div class="dashboard-container page">
    <ul class="dashboard-nav">
      <li v-for="({title,name,icon}) in nav"
          :key="name"
          @click="redirect(name)">
        <icon-svg :type="icon"></icon-svg>
        <p>{{title}}</p>
      </li>
    </ul>
  </div>
</template>
<script>
import IconSvg from '@/components/IconSvg'
export default {
  name: 'dashboard',
  components: {
    IconSvg
  },
  data () {
    return {
      // 导航菜单
      nav: [
        {
          title: 'RGB,十六进制互换',
          name: 'colorTransform',
          icon: 'icon-rgb'
        },
        {
          title: 'JSON格式化',
          name: 'jsonFormat',
          icon: 'icon-json'
        },
        {
          title: 'SVG压缩',
          name: 'svgCompress',
          icon: 'icon-svg'
        }
      ]
    }
  },
  methods: {
    // 跳转页面
    redirect (name) {
      this.$router.push({ name })
    }
  }
}
</script>
<style lang="scss">
.dashboard-container {
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dashboard-nav {
  display: flex;
  li {
    width: 200px;
    height: 200px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    margin: 20px;
    cursor: pointer;
    transition: all 0.5s ease;
    .icon-svg {
      font-size: 48px;
      transition: all 0.5s ease;
    }
    p {
      width: 100%;
      margin-top: 30px;
      text-align: center;
    }
  }
}
</style>
