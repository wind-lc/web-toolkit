<!--
/**
* @description svg压缩
* @author wind-lc
* @date 2020-12-02
*/
-->
<template>
  <div class="svg-compress-container page">
    <div class="svg-compress-content">
      <!-- 文件读取 -->
      <div class="svg-compress-import"
           @click="openFile">
        <icon-svg type="icon-add"></icon-svg>
        <p>点击或者拖拽文件，以及直接粘贴svg代码到此处</p>
      </div>
      <!-- 文件读取 -->
      <!-- 文件列表 -->
      <table class="svg-compress-list">
        <thead>
          <tr>
            <th>预览</th>
            <th>代码</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in afterFiles"
              :key="index">
            <td class="svg-compress-preview"
                v-html="item.svg"></td>
            <td class="svg-compress-code">
              <div class="svg-compress-compressibility">
                <span>{{item.beforeSize}}kb ==> {{item.afterSize}}kb</span>
                <span>
                  <i>↓</i>
                  {{item.compressibility}}%
                </span>
              </div>
              <textarea :value="item.svg"
                        spellcheck="false"></textarea>
            </td>
            <td class="svg-compress-preview-operation">

              <div>
                <button @click="download(item)">
                  <icon-svg type="icon-download"></icon-svg>
                </button>
                <button @click="copy(item.svg)">
                  <icon-svg type="icon-copy"></icon-svg>
                </button>
                <button @click="deleteItem(index)">
                  <icon-svg type="icon-delete"></icon-svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 文件列表 -->
      <w-message :message="message"
                 :visible.sync="messageVisible"></w-message>
    </div>
  </div>
</template>
<script>
import IconSvg from '@/components/IconSvg'
import Compress from './js/compressSvg.js'
import wMessage from '@/components/wMessage'
export default {
  name: 'svgCompress',
  components: {
    IconSvg,
    wMessage
  },
  data () {
    return {
      // 文件列表
      files: [],
      // 压缩后文件
      afterFiles: [],
      // 提示信息
      message: {
        type: '',
        text: ''
      },
      // 提示信息可见
      messageVisible: false
    }
  },
  created () {
    this.ipcListener()
  },
  methods: {
    // 主进程响应监听
    ipcListener () {
      // 文件选择回调
      this.$ipcRenderer.on('file-return', (event, arg) => {
        if (arg.status === 'success') {
          Promise.all(arg.data.filePaths.map(el => this.getFile(el))).then(res => {
            this.files = res
            this.compressSvg()
          }).catch(error => {
            console.log(error)
          })
        } else {
          console.log(arg.data)
        }
      })
      // 文件保存回调
      this.$ipcRenderer.on('file-save-return', (event, arg) => {
        if (arg.status === 'success') {
          this.message = {
            type: 'success',
            text: arg.data
          }
          this.messageVisible = true
        } else {
          console.log(arg.data)
        }
      })
    },
    // 获取文件
    async getFile (file) {
      let obj = {}
      await Promise.all([this.readFile(file), this.stat(file)]).then(res => {
        obj = {
          file: res[0],
          stat: res[1]
        }
      }).catch(error => {
        console.log(error)
      })
      return obj
    },
    // 读取文件
    readFile (url) {
      return new Promise((resolve, reject) => {
        this.$fs.readFile(url, 'utf8', function (error, data) {
          if (error) {
            reject(error)
          } else {
            resolve(data)
          }
        })
      })
    },
    // 获取文件状态
    stat (url) {
      return new Promise((resolve, reject) => {
        this.$fs.stat(url, function (error, data) {
          if (error) {
            reject(error)
          } else {
            resolve(data)
          }
        })
      })
    },
    // 打开文件选择器
    openFile () {
      this.$ipcRenderer.send('open-file', true)
    },
    // 压缩svg
    compressSvg () {
      this.afterFiles = this.afterFiles.concat(this.files.map(el => {
        const svg = new Compress(el, {
          statement: true
        })
        svg.convert()
        return svg
      }))
    },
    // 下载
    download (file) {
      this.$ipcRenderer.send('save-file', file.svg)
    },
    // 复制
    copy (svg) {
      navigator.clipboard.writeText(svg).catch(error => {
        console.log(error)
      })
    },
    // 删除
    deleteItem (index) {
      this.afterFiles.splice(index, 1)
    }
  }
}
</script>
<style lang="scss">
.svg-compress-container {
  display: flex;
  justify-content: center;
}
.svg-compress-content {
  width: 80%;
  max-width: 900px;
  display: flex;
  flex-flow: column;
}
.svg-compress-import {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  transition: all 0.5s ease;
  cursor: pointer;
  .icon-svg {
    font-size: 36px;
  }
  p {
    width: 100%;
    text-align: center;
    margin-top: 40px;
  }
}
.svg-compress-list {
  margin-top: 20px;
  height: calc(100% - 220px);
  thead {
    tr {
      display: table;
      width: 100%;
      table-layout: fixed;
      th {
        height: 40px;
        text-align: center;
        &:nth-of-type(1) {
          width: 120px;
        }
        &:nth-of-type(3) {
          width: 160px;
        }
      }
    }
  }
  tbody {
    display: block;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    tr {
      display: table;
      width: 100%;
      table-layout: fixed;
      td {
        padding: 20px;
        text-align: center;
        &:nth-of-type(2) {
          padding: 20px 0;
        }
      }
    }
  }
}
.svg-compress-preview {
  width: 120px;
  svg {
    width: 40px;
  }
}
.svg-compress-code {
  textarea {
    resize: none;
    height: 100px;
    width: 100%;
    line-height: 1.5em;
  }
}
.svg-compress-preview-operation {
  width: 160px;
  button {
    cursor: pointer;
  }
  .icon-svg {
    font-size: 16px;
  }
}
.svg-compress-compressibility {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  i {
    position: absolute;
    left: -7px;
    top: -1px;
    font-size: 12px;
  }
  span {
    position: relative;
    margin: 0 8px;
  }
}
</style>
