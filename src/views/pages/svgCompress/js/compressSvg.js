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
  },
  xlink: {
    start: 'xmlns:xlink="',
    end: '"'
  },
  pId: {
    start: 'p-id="',
    end: '"'
  },
  width: {
    start: 'width="',
    end: '"'
  },
  height: {
    start: 'height="',
    end: '"'
  },
  t: {
    start: 't="',
    end: '"'
  },
  fill: {
    start: 'fill="',
    end: '"'
  }
}

/**
   * 压缩svg
   * @param {String} svg svg文件字符串
   * @param {Object} config 配置
   */
class Compress {
  constructor (file, config) {
    this.svg = file.file
    this.stat = file.stat
    this.length = 0
    this.config = config
    this.labelKey = labelKey
    this.doubleLabelKey = doubleLabelKey
    this.attributeKey = attributeKey
    this.beforeSize = 0
    this.afterSize = 0
    this.compressibility = 0
  }

  // 转换
  convert () {
    // 去除回车
    this.svg = this.svg.replace(/[\r\n]/g, '')
    this.length = this.svg.length
    for (const item in this.labelKey) {
      this.deleteLabel(labelKey[item])
    }
    for (const item in this.doubleLabelKey) {
      this.deleteDoubleLabel(doubleLabelKey[item])
    }
    for (const item in this.attributeKey) {
      this.deleteAttribute(attributeKey[item])
    }
    this.deleteLongDecimals()
    // 去除多余空格
    this.svg = this.svg.replace(/\s+/g, ' ')
    this.svg = this.svg.replace(/\s+>/g, '>')
    // 修改path为单标签
    this.svg = this.svg.replace(/><\/path>/g, '/>')
    this.getCompressibility()
  }

  // 获取压缩率
  getCompressibility () {
    const blob = new Blob([this.svg], { type: 'image/svg+xml' })
    this.beforeSize = Math.ceil(this.stat.size / 1024 * 100) / 100
    this.afterSize = Math.ceil(blob.size / 1024 * 100) / 100
    this.compressibility = Number(parseFloat(100 - blob.size / this.stat.size * 100).toFixed(2))
  }

  // 去除单标签或者属性
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
  deleteAttribute (lable) {
    const arr = this.svg.split(lable.start)
    const num = arr.length - 1
    let lng = 0
    for (let i = 0; i < num; i++) {
      lng += arr[i].length
      const start = this.svg.indexOf(lable.start)
      if (start < 0) {
        continue
      } else {
        const thisLng = arr[i + 1].indexOf(lable.end)
        const end = lng + thisLng + lable.end.length + lable.start.length
        this.svg = this.svg.split(this.svg.substring(start, end)).join('')
        lng -= thisLng + lable.end.length
      }
    }
  }

  // 小数保留三位
  deleteLongDecimals () {
    const arr = this.svg.match(/\d+(\.\d+)/g)
    arr.forEach(el => {
      if (el.split('.')[1].length > 3) {
        this.svg = this.svg.replace(el, Number(el).toFixed(3))
      }
    })
  }
}

export default Compress
