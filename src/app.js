import drawRingProgress from '@/components/drawRingProgress'
import Config from '@/config'
import drawLoadChart from '@/components/drawLoadChart'
import drawPieChart from '@/components/drawPieChart'
import drawLineChart from '@/components/drawLineChart'
import drawBarChart from '@/components/drawBarChart'
import drawStackbarChart from '@/components/drawStackbarChart'
import drawRingChart from '@/components/drawRingChart'
import { measureText } from '@/components/utils.js'

export function Charts(opts={}) {
    this.ready = false
    this.opts = opts
    if (typeof wx != 'undefined') {
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
    }
    this.type = opts.type || ''
    this.chartData = opts.chartData || {}
    if (this.context.measureText === undefined) {
        this.context.measureText = function (text) {
            let fontSize = /(\d+)px/.test(this.font) ? parseInt(RegExp.$1) : 10
            let width = measureText(text, fontSize)
            return { width }
        }
    }
}

Charts.prototype.draw = function () {
    this.context.clearRect(0, 0, this.opts.width, this.opts.height)
    switch (this.type) {
        case 'ring-progress':
            drawRingProgress(this, Config)
            break
        case 'load-chart':
            drawLoadChart(this, Config)
            break
        case 'pie':
            drawPieChart(this.context, this.chartData.data, this.opts, Config)
            break
        case 'line':
            drawLineChart(this.context, this.chartData.data, this.opts, Config)
            break
        case 'bar':
            drawBarChart(this.context, this.chartData.data, this.opts, Config)
            break
        case 'stack-bar':
            drawStackbarChart(this.context, this.chartData.data, this.opts, Config)
            break
        case 'ring':
            drawRingChart(this.context, this.chartData.data, this.opts, Config)
            break
        default:
            break
    }
}

Charts.prototype.feed = function(data = {}) {
    if (data instanceof Array) {
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

export default Charts