import drawRingProgress from '@/components/drawRingProgress'
import Config from '@/config'
import drawLoadChart from '@/components/drawLoadChart'

export function Charts(opts) {

    try {
        const query = wx.createSelectorQuery()
        query.select('#'+opts.canvasId)
        .fields({ node: true, size: true })
        .exec((res) => {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            this.dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = res[0].width * this.dpr
            canvas.height = res[0].height * this.dpr
            this.width = res[0].width
            this.height = res[0].height
            this.context = ctx
            this.context.scale(this.dpr, this.dpr)
            console.log(this.canvas)
        })
    } catch {
        let canvas = document.getElementById(opts.canvasId)
        let {height, width} = canvas.getBoundingClientRect()
        this.width = width
        this.height = height
        canvas.width = width
        canvas.height = height
        this.dpxRatio = window.devicePixelRatio
        this.context = canvas.getContext('2d');
        this.context.scale(this.dpxRatio, this.dpxRatio)
    }
    this.opts = opts
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
        default:
            break
    }
}

Charts.prototype.feed = function(data = {}) {
    this.chartData = data
    this.draw()
}

export default Charts