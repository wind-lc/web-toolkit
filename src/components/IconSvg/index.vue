<!--
/**
* @name IconSvg
* @description 自定义icon图标
*              新增svg步骤:
*              1.下载svg文件(本项目从 https://www.iconfont.cn 图标库获取svg)
*              2.压缩svg文件(可以使用在线压缩工具 https://www.zhangxinxu.com/sp/svgo/ 完成压缩并获取到压缩之后的svg,另外可以自行使用 https://github.com/svg/svgo 压缩svg)
*              3.修改svg名称为iconfont图标的代码名(其他途径获取svg自行命名)
*              4.组件中引入使用即可
* @author wind-lc
* @date 2020-06-09
* @param {String} type 图标名
* @example <icon-svg type="icon-time"></icon-svg>
*/
-->
<template>
  <svg class="icon-svg"
       aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'IconSvg',
  props: {
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    iconName () {
      return `#icon-${this.type}`
    }
  }
}
</script>

<style scoped>
.icon-svg {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
