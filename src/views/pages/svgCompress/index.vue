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
      <div class="svg-compress-import"
           @click="openFile">
        <icon-svg type="icon-add"></icon-svg>
        <p>点击或者拖拽文件，以及直接粘贴svg代码到此处</p>
      </div>
    </div>
  </div>
</template>
<script>
import IconSvg from '@/components/IconSvg'
import Compress from './js/compressSvg.js'
export default {
  name: 'svgCompress',
  components: {
    IconSvg
  },
  data () {
    return {
      // 文件列表
      files: []
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
            console.log(res)
            this.compressSvg()
          }).catch(error => {
            console.log(error)
          })
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
      const svg = new Compress(this.files[0], {
        statement: true
      })
      svg.convert()
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
</style>
