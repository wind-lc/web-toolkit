/**
* @fileOverview 压缩svg
* @author wind-lc
* @version 1.0
*/

const label = {
  statementStart: '<?',
  statementEnd: '?>',
  doctypeStart: '<!DOCTYPE',
  doctypeEnd: '>',
  tagOpenStart: '<',
  tagOpenEnd: '>',
  tagCloseStart: '</',
  tagCloseEnd: '>',
  tagShortStart: '<',
  tagShortEnd: '/>',
  attrStart: '="',
  attrEnd: '"',
  commentStart: '<!--',
  commentEnd: '-->',
  cdataStart: '<![CDATA[',
  cdataEnd: ']]>'
}
/**
   * 压缩svg
   * @param {String} svg svg文件字符串
   * @param {Object} config 配置
   */
class Compress {
  constructor (svg, config) {
    this.svg = svg
    this.config = config
    this.label = label
    this.node = []
  }

  // 转换
  convert () {

  }
}

export default Compress
