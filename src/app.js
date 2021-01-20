import drawRingProgress from '@/components/drawRingProgress'
import Config from '@/config'
import drawLoadChart from '@/components/drawLoadChart'
import drawPieChart from '@/components/drawPieChart'
import drawLineChart from '@/components/drawLineChart'
import drawBarChart from '@/components/drawBarChart'
import drawStackbarChart from '@/components/drawStackbarChart'

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
            this.dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = res[0].width * this.dpr
            canvas.height = res[0].height * this.dpr
            this.opts.width = res[0].width
            this.opts.height = res[0].height
            this.context = ctx
            this.context.scale(this.dpr, this.dpr)
            this.ready = true
            typeof this.onReady === 'function' && this.onReady()
            console.log(this)
        })
    } else {
        let canvas = document.getElementById(opts.canvasId)
        let {height, width} = canvas.getBoundingClientRect()
        this.opts.width = width
        this.opts.height = height
        this.dpxRatio = window.devicePixelRatio
        canvas.width = width * this.dpxRatio // 设置canvas 大小
        canvas.height = height * this.dpxRatio
        this.context = canvas.getContext('2d');
        this.context.scale(this.dpxRatio, this.dpxRatio)
        this.ready = true
    }
    this.type = opts.type || ''
    this.chartData = opts.chartData || {}
}

Charts.prototype.draw = function () {
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
        default:
            break
    }
}

Charts.prototype.feed = function(data = {}) {
    this.chartData = data
    if (this.ready) {
        this.draw()
    } else {
        this.onReady = () => {
            this.draw()
        }
    }
}

export default Charts