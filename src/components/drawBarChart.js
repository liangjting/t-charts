import { drawAxis, calcAxisSeries } from './drawAxis'
import { getRelativeRegion } from './utils'

function darwBar(context, series) {
    for (let item of series) {
        item.color && (context.fillStyle = item.color)
        context.fillRect(...item.data)
    }
}
export default function drawBarChart(context, series, opts, config) {
    let xLabels = []
    let arr = series.map(item => {
        xLabels.push(item.label)
        return [item.label, item.data]
    })
    opts.xLabels = xLabels
    let axis = calcAxisSeries(arr, opts)
    let region = getRelativeRegion(opts.width, opts.height)
    let result = drawAxis(context, axis, region, opts, config)
    console.log(result)

    let bars = []
    let barHalfWidth = (opts.barWidth || 16) >> 1
    let {width, height, bottom} = result.region
    let yMax = result.yMax
    xLabels = result.xLabels
    for (let [i, item] of Object.entries(series)) {
        bars.push({
            color: item.color || 'red',
            data: [xLabels[i][0] - barHalfWidth, bottom - item.data / yMax * height, barHalfWidth * 2, item.data / yMax * height]
        })
    }
    console.log(bars)
    darwBar(context, bars)
}