<!--
/**
* @description JSON格式化
* @author wind-lc
* @date 2021-01-11
*/
-->
<template>
  <div class="json-format-container page">
    <div class="json-format-content">
      <div class="json-format-edit"
           ref="edit"></div>
      <div class="json-format-btn-wrapper">
        <button class="json-format-btn"
                @click="format">格式化</button>
        <button class="json-format-btn">压缩</button>
      </div>
    </div>
  </div>
</template>
<script>
import * as monaco from 'monaco-editor'
export default {
  name: 'jsonFormat',
  components: {},
  data () {
    return {
      // 光标位置
      cursorPosition: {
        x: 0,
        y: 0
      },
      // json数据
      text: '{"msg": "success"}',
      edit: [

      ],
      jsonData: {

      },
      // 编辑器
      editor: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 初始化编辑器
    init () {
      this.editor = monaco.editor.create(this.$refs.edit, {
        value: '',
        language: 'json',
        theme: 'vs-dark',
        automaticLayout: true,
        'vs/nls': {
          availableLanguages: {
            '*': 'zh-cn'
          }
        }
      })
    },
    format () {
      // console.log(this.editor.getValue())
    }
  },
  beforeDestroy () {
    this.editor.dispose()
    this.editor = null
  }
}
</script>
<style lang="scss">
.json-format-container {
  display: flex;
  justify-content: center;
}
.json-format-content {
  width: 80%;
  max-width: 900px;
  // font-family: Consolas, 'Segoe UI emoji';
}
.json-format-edit {
  height: calc(100% - 100px);
}
.json-format-btn-wrapper {
  display: flex;
  margin-top: 10px;
}
.json-format-btn {
  outline: none;
  border: none;
  height: 24px;
  padding: 0 10px;
  margin-right: 10px;
  cursor: pointer;
}
</style>
