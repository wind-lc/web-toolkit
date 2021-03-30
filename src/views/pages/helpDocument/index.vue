<!--
/**
* @description 帮助文档
* @author wind-lc
* @date 2021-02-23
*/
-->
<template>
  <div class="help-document page">
    <div class="help-document-content">
      <h4>1.点击左上角LOGO即可返回首页</h4>
      <h4>2.RGB和16进制互换</h4>
      <ul>
        <li>● 点击箭头可以实现RGB颜色和16进制互相转换</li>
        <li>● RGB：RGB颜色</li>
        <li>● HEX：16进制颜色</li>
        <li>● 右侧方框颜色预览</li>
      </ul>
      <h4>3.SVG文件压缩，可以到[iconfont](https://www.iconfont.cn/)下载图标svg</h4>
      <ul>
        <li>● 点击选择SVG文件选择好SVG文件，自动压缩</li>
        <li>● 压缩完成后可以预览SVG，以及显示压缩比例</li>
        <li>● 下载、复制以及删除当前SVG</li>
      </ul>
      <h4>4.屏幕取色器</h4>
      <ul>
        <li>● 点击吸管即可开始取色，此时鼠标会变成吸管</li>
        <li>● 移动鼠标到想要取色的地方点击即可完成取色</li>
        <li>● X,Y：鼠标坐标</li>
        <li>● HEX：16进制颜色</li>
        <li>● RGB：RGB颜色</li>
        <li>● 右侧方框颜色预览</li>
      </ul>
      <h4>5.JSON格式化</h4>
      <ul>
        <li>● 输入或者粘贴JSON代码到文本域</li>
        <li>● 点击格式化按钮即可格式化JSON</li>
        <li>● 点击压缩即可压缩JSON</li>
        <li>● 点击复制即可复制JSON代码到剪贴板</li>
      </ul>
      <h4>6.支持换肤有三种皮肤可选择</h4>
    </div>
  </div>
</template>
<script>
export default {
  name: 'helpDocument',
  components: {},
  data () {
    return {}
  }
}
</script>
<style lang="scss">
.help-document-content {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  h4 {
    font-size: 18px;
    font-weight: normal;
    line-height: 1.75em;
  }
  ul {
    text-indent: 2em;
    li {
      line-height: 1.5em;
    }
  }
}
</style>
