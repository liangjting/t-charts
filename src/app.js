import drawRingProgress from '@/components/drawRingProgress'
import Config from '@/config'
import drawLoadChart from '@/components/drawLoadChart'
import drawPieChart from '@/components/drawPieChart'
import drawLineChart from '@/components/drawLineChart'
import drawBarChart from '@/components/drawBarChart'
import drawStackbarChart from '@/components/drawStackbarChart'
import drawRingChart from '@/components/drawRingChart'
import drawKAvgChart from '@/components/drawKAvgChart'
import { measureText } from '@/components/utils.js'

export function Charts(opts={}, component) {
    this.ready = false
    this.opts = opts
    if (typeof uni !== 'undefined') {
        let query = component ? uni.createSelectorQuery().in(component) : uni.createSelectorQuery()
        // if (component) query.in(component)
        query.select('#'+opts.canvasId).fields({context: true, size: true}).exec(res => {
            // console.log(res)
            let ctx = res[0].context // component ? uni.createCanvasContext(opts.canvasId, component) : res[0].context // uni.createCanvasContext(opts.canvasId)
            // ctx.setFillStyle('red')
            // ctx.fillRect(0, 0, 300, 150)
            // ctx.draw()
            this.res = res[0]
            this.opts.width = res[0].width || 350
            this.opts.height = res[0].height || 200
            this.context = ctx
            // this.context.scale(dpr, dpr)
            // this.opts.dpr = dpr
            if (this.context.measureText === undefined) {
                this.context.measureText = function (text) {
                    let fontSize = /(\d+)px/.test(this.font) ? parseInt(RegExp.$1) : 10
                    let width = measureText(text, fontSize)
                    return { width }
                }
            }
            this.ready = true
            typeof this.onReady === 'function' && this.onReady()
        })
        
    } else if (typeof wx != 'undefined') {
        const query = wx.createSelectorQuery()
        query.select('#'+opts.canvasId)
        .fields({ node: true, size: true })
        .exec((res) => {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            let dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = res[0].width * dpr
            canvas.height = res[0].height * dpr
            this.opts.width = res[0].width
            this.opts.height = res[0].height
            this.context = ctx
            this.context.scale(dpr, dpr)
            this.opts.dpr = dpr
            if (this.context.measureText === undefined) {
                this.context.measureText = function (text) {
                    let fontSize = /(\d+)px/.test(this.font) ? parseInt(RegExp.$1) : 10
                    let width = measureText(text, fontSize)
                    return { width }
                }
            }
            this.ready = true
            typeof this.onReady === 'function' && this.onReady()
            console.log(this)
        })
    } else {
        let canvas = document.getElementById(opts.canvasId)
        let {height, width} = canvas.getBoundingClientRect()
        this.opts.width = width
        this.opts.height = height
        let dpr  = window.devicePixelRatio
        canvas.width = width * dpr // 设置canvas 大小
        canvas.height = height * dpr
        this.context = canvas.getContext('2d');
        this.context.scale(dpr, dpr)
        this.opts.dpr = dpr
        this.ready = true
        if (this.context.measureText === undefined) {
            this.context.measureText = function (text) {
                let fontSize = /(\d+)px/.test(this.font) ? parseInt(RegExp.$1) : 10
                let width = measureText(text, fontSize)
                return { width }
            }
        }
    }
    this.type = opts.type || ''
    this.chartData = opts.chartData || {}
    this.opts.xOffset = 0
}

Charts.config = Config

Charts.prototype.draw = function () {
    this.context.clearRect(0, 0, this.opts.width, this.opts.height)
    switch (this.type) {
        case 'ring-progress':
            drawRingProgress(this, Config)
            break
        case 'load-chart':
            drawLoadChart(this, Config, this.opts)
            break
        case 'pie':
            drawPieChart(this.context, this.chartData.data, this.opts, Config)
            break
        case 'line':
            drawLineChart(this.context, this.chartData, this.opts, Config)
            break
        case 'bar':
            drawBarChart(this.context, this.chartData.data, this.opts, Config)
            break
        case 'stack-bar':
            drawStackbarChart(this.context, this.chartData.data, this.opts, Config)
            break
        case 'ring':
            drawPieChart(this.context, this.chartData.data, this.opts, Config)
            break
        case 'k-avg':
            drawKAvgChart(this.context, this.chartData.data, this.opts, Config)
            break
        default:
            break
    }
    this.context.draw && this.context.draw() // uni app 
}

Charts.prototype.feed = function(data = {}) {
    if (data instanceof Array || Object.prototype.toString.call(data).indexOf('Array') >= 0) {
        this.chartData = {data}
    } else {
        this.chartData = data
    }
    if (this.ready) {
        this.draw()
    } else {
        this.onReady = () => {
            this.draw()
        }
    }
}

Charts.prototype.scrollBy = function(offset=0) {
    // console.log('scrollBy')
    if (this.opts.chartWidth && this.opts.chartViewportWidth && offset != 0) {
        if (this.opts.chartWidth <= this.opts.chartViewportWidth) {
            return
        }
        let pos = this.opts.xOffset + offset
        pos = pos > 0 ? 0 : pos
        
        if (pos < this.opts.chartViewportWidth - this.opts.chartWidth) {
            pos = this.opts.chartViewportWidth - this.opts.chartWidth
        }
        
        if (this.opts.xOffset != pos) {
            this.opts.xOffset = pos
            if (this.ready) {
                this.draw()
            } else {
                this.onReady = () => {
                    this.draw()
                }
            }
        }
    }
}


export default Charts