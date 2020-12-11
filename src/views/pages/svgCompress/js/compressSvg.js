/**
* @fileOverview 压缩svg
* @author wind-lc
* @version 1.0
*/

const labelKey = {
  doctype: {
    start: '<!DOCTYPE',
    end: '>'
  },
  comment: {
    start: '<!--',
    end: '-->'
  },
  version: {
    start: '<?',
    end: '?>'
  }
}
const doubleLabelKey = {
  defs: {
    open: {
      start: '<defs',
      end: '>'
    },
    close: {
      start: '</defs',
      end: '>'
    }
  }
}
const attributeKey = {
  version: {
    start: 'version="',
    end: '"'
  }
}

/**
   * 压缩svg
   * @param {String} svg svg文件字符串
   * @param {Object} config 配置
   */
class Compress {
  constructor (svg, config) {
    this.svg = svg
    this.tempSvg = svg.replace(/[\r\n]/g, '')
    this.length = this.tempSvg.length
    this.config = config
    this.labelKey = labelKey
    this.doubleLabelKey = doubleLabelKey
    this.attributeKey = attributeKey
    this.node = []
  }

  // 转换
  convert () {
    // 去除回车
    this.svg = this.svg.replace(/[\r\n]/g, '')
    for (const item in this.labelKey) {
      this.deleteLabel(labelKey[item])
    }
    for (const item in this.doubleLabelKey) {
      this.deleteDoubleLabel(doubleLabelKey[item])
    }
  }

  // 去除单标签
  deleteLabel (lable) {
    const arr = this.svg.split(lable.start)
    const num = arr.length - 1
    let lng = 0
    for (let i = 0; i < num; i++) {
      lng += arr[i].length
      const start = this.svg.indexOf(lable.start)
      if (start < 0) {
        continue
      } else {
        const end = lng + arr[i + 1].indexOf(lable.end) + lable.end.length + lable.start.length
        this.svg = this.svg.split(this.svg.substring(start, end)).join('')
      }
    }
  }

  // 去除双单标签
  deleteDoubleLabel (lable) {
    const openArr = this.svg.split(lable.open.start)
    const openNum = openArr.length - 1
    let openLng = 0
    for (let i = 0; i < openNum; i++) {
      openLng += openArr[i].length
      const start = this.svg.indexOf(lable.open.start)
      if (start < 0) {
        continue
      } else {
        const end = openLng + openArr[i + 1].indexOf(lable.open.end) + lable.open.end.length + lable.open.start.length + openArr[i + 1].indexOf(lable.close.start) + lable.close.start.length
        this.svg = this.svg.split(this.svg.substring(start, end)).join('')
      }
    }
  }

  // 去除属性
  deleteAttribute () {

  }

  //

  // 提取标签
  getLabel () {
    // if (this.tempSvg.length > 0) {
    //   for (const item in labelKey) {
    //     const start = this.tempSvg.indexOf(labelKey[item].start)
    //     const end = this.tempSvg.indexOf(labelKey[item].end) + labelKey[item].end.length
    //     if (start < 0) {
    //       continue
    //     } else {
    //       this.node.push({
    //         name: item,
    //         node: this.tempSvg.substring(start, end)
    //       })
    //       this.tempSvg = this.tempSvg.substring(end)
    //       this.getLabel()
    //       break
    //     }
    //   }
    // }
    for (let i = 0; i < this.length; i++) {
      for (const item in labelKey) {
        const start = this.tempSvg.indexOf(labelKey[item].start)
        if (start < 0) {
          continue
        } else {
          const end = this.tempSvg.split(labelKey[item].start)[0].length + this.tempSvg.split(labelKey[item].start)[1].indexOf(labelKey[item].end) + labelKey[item].start.length + labelKey[item].end.length
          const label = this.tempSvg.substring(start, end)
          this.node.push({
            name: item,
            node: label
          })
          this.tempSvg = this.tempSvg.split(label).join('')
        }
      }
      console.log(this.tempSvg)
    }
  }
}

export default Compress
