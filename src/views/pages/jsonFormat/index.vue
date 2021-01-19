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
        <button class="json-format-btn"
                @click="compress">压缩</button>
        <button class="json-format-btn"
                @click="copy">复制</button>
      </div>
    </div>
    <w-message :message="message"
               :visible.sync="messageVisible"></w-message>
  </div>
</template>
<script>
import * as monaco from 'monaco-editor'
import wMessage from '@/components/wMessage'
import { mapGetters } from 'vuex'
export default {
  name: 'jsonFormat',
  components: {
    wMessage
  },
  data () {
    return {
      // 光标位置
      cursorPosition: {
        x: 0,
        y: 0
      },
      // 提示信息
      message: {
        type: '',
        text: ''
      },
      // 提示信息可见
      messageVisible: false,
      // 编辑器
      editor: null

    }
  },
  computed: {
    ...mapGetters(['getUi'])
  },
  watch: {
    getUi: {
      handler (newV, oldV) {
        monaco.editor.setTheme(newV.skin === 'night-theme' ? 'vs-dark' : 'vs')
      }
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
        theme: this.getUi.skin === 'night-theme' ? 'vs-dark' : 'vs',
        automaticLayout: true,
        tabSize: 2
      })
    },
    // 格式化
    format () {
      try {
        this.editor.setValue(JSON.stringify(JSON.parse(this.editor.getValue()), null, 2))
      } catch (error) {
        const err = error.toString().split(' ')
        let index = err[err.length - 1]
        if (isNaN(index)) {
          index = 0
        }
        this.message = {
          type: 'error',
          text: `JSON中${index}位置处错误标记！`
        }
        this.messageVisible = true
      }
    },
    // 压缩
    compress () {
      try {
        this.editor.setValue(JSON.stringify(JSON.parse(this.editor.getValue())))
      } catch (error) {
        const err = error.toString().split(' ')
        let index = err[err.length - 1]
        if (isNaN(index)) {
          index = 0
        }
        this.message = {
          type: 'error',
          text: `JSON中${index}位置处错误标记！`
        }
        this.messageVisible = true
      }
    },
    // 复制
    copy () {
      navigator.clipboard.writeText(this.editor.getValue()).then(res => {
        this.message = {
          type: 'success',
          text: '已复制到剪贴板！'
        }
        this.messageVisible = true
      }).catch(error => {
        console.log(error)
      })
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
}
.json-format-edit {
  height: calc(100% - 34px);
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
