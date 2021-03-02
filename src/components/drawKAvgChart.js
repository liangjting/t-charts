import { drawAxis, calcAxisSeries} from './drawAxis'
import { getRelativeRegion } from './utils'

function drawLine(context, series) {
    for (let item of series) {
        context.beginPath()
        item.color && (context.fillStyle = item.color)
        context.arc(...item.data, 3, 0, 2 * Math.PI)
        context.fill()
    }
    if (series.length > 1) {
        series[0].color && (context.strokeStyle = series[0].color)
        context.beginPath()
        context.moveTo(...series[0].data)
        for (let i = 1; i < series.length; i++) {
            context.lineTo(...series[i].data)
        }
        context.stroke()
    }
}

function darwBars(context, series) {
    for (let item of series) {
        item.color && (context.fillStyle = item.color)
        // context.fillRect(...item.data)
        
        context.beginPath()
        context.moveTo(item.data[0], item.data[1] + item.barWidth / 2)
        context.arc(item.data[0] + item.barWidth / 2, item.data[1] + item.barWidth / 2, item.barWidth / 2, Math.PI, 2 * Math.PI)
        context.lineTo(item.data[0] + item.barWidth, item.data[1] + item.data[3] - item.barWidth / 2)
        context.arc(item.data[0] + item.barWidth / 2, item.data[1] + item.data[3] - item.barWidth / 2, item.barWidth / 2, 0,  Math.PI)
        context.closePath()
        context.fill()
    }
}
export default function drawKAvgChart(context, series, opts, config) {
    let xLabels = []
    let arr = series.map(item => {
        xLabels.push(item.label)
        return [item.label, item.data.reduce((a, b) => a > b ? a: b, 0)]
    })
    opts.xLabels = xLabels
    let axis = calcAxisSeries(arr, opts)
    // let region = getRelativeRegion(opts.width, opts.height)
    let padding = config.padding || 0
    let bottomAreaHeight = 2
    let chartRegion = getRelativeRegion(opts.width, opts.height, padding, {bottom: bottomAreaHeight, left: 0})
    let result = drawAxis(context, axis, chartRegion, opts, config)

    let bars = []
    let avgPoints = []
    let barWidth = (opts.barWidth || 16)
    let barHalfWidth =  barWidth >> 1
    let {width, height, bottom} = result.region
    let yMax = result.yMax
    xLabels = result.xLabels
    for (let [i, item] of Object.entries(series)) {
        bars.push({
            color: item.color || '#32bbb0',
            data: [xLabels[i][0] - barHalfWidth, bottom - item.data[1] / yMax * height, barHalfWidth * 2, (item.data[1] - item.data[0]) / yMax * height],
            barWidth,
        })
        avgPoints.push({
            color: item.lineColor || 'orange',
            data: [xLabels[i][0], bottom - item.data[2] / yMax * height]
        })
    }
    // console.log(bars)
    darwBars(context, bars)
    drawLine(context, avgPoints)
}