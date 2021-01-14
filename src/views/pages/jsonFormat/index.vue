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

      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 初始化编辑器
    init () {
      monaco.editor.create(this.$refs.edit, {
        value: '{"msg": "success"}',
        language: 'json',
        theme: 'vs-dark',
        'vs/nls': {
          availableLanguages: {
            '*': 'zh-cn'
          }
        }
      })
    }

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
</style>
