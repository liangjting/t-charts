import { drawAxis, calcAxisSeries} from './drawAxis'
import { getRelativeRegion, darwBars } from './utils'

/**
 * 
 * @param {*} context 
 * @param {*} series 
 * @param {{barWidth, xLabels}} opts 
 * @param {*} config 
 */
export default function drawBarChart(context, series, opts, config) {
    let xLabels = []
    let arr = series.map(item => {
        xLabels.push(item.label)
        return [item.label, item.data]
    })
    opts.xLabels = xLabels
    let axis = calcAxisSeries(arr, opts, config)
    let chartRegion = getRelativeRegion(opts.width, opts.height)
    // let result = drawAxis(context, axis, region, opts, config)
    // console.log(result)
    opts.labelOpt = 'yaxis' // 横向轴线
    let result = drawAxis(context, axis, chartRegion, opts, config)
    
    // 记录图表长度和视图宽度
    opts.chartWidth = result.chartWidth
    opts.chartViewportWidth = result.region.width
    let bars = []
    let barHalfWidth = (opts.barWidth || 16) >> 1
    let {width, height, bottom} = result.region
    let yMax = result.yMax
    xLabels = result.xLabels
    for (let [i, item] of Object.entries(series)) {
        bars.push({
            color: item.color || opts.color || 'red',
            data: [xLabels[i][0] - barHalfWidth, bottom - item.data / yMax * height, barHalfWidth * 2, item.data / yMax * height]
        })
    }
    // console.log(bars)

    context.save()
    if (result.chartWidth > width && opts.xOffset != undefined) {
        if (opts.xOffset < width - result.chartWidth) {
            opts.xOffset = width - result.chartWidth
        }
        context.translate(opts.xOffset, 0)
    }
    opts.labelOpt = 'xl'
    drawAxis(context, axis, chartRegion, opts, config)

    // 过滤掉超出画布显示的部分
    bars = bars.filter(item => {
        let left = item.data[0] + opts.xOffset
        let right = item.data[0] + item.data[2] + opts.xOffset
        return (left >= result.region.left && left <= result.region.right) || (right >= result.region.left && right <= result.region.right)
    })
    darwBars(context, bars)
    context.restore()
    context.clearRect(0, 0, result.region.left, opts.height)
    opts.labelOpt = 'yl'
    drawAxis(context, axis, chartRegion, opts, config)
}