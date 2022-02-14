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
    let barWidth = opts.barWidth || 16
    let barMargin = opts.barMargin || 1
    let arr = series.map(item => {
        if (item instanceof Array) {
            xLabels.push(''+item[0])
            return [...item]
        } else {
            xLabels.push(item.label)
            return [item.label, item.data]
        }
    })
    opts.xLabels = opts.xLabelNum ? null : xLabels
    let xLabelNum = opts.xLabelNum || series.length || 1
    let axis = calcAxisSeries(arr, opts, config)
    let chartRegion = getRelativeRegion(opts.width, opts.height)
    // let result = drawAxis(context, axis, region, opts, config)
    // console.log(result)
    opts.xLabelMinWidth = opts.xLabelMinWidth || (barWidth + barMargin) * series.length / xLabelNum
    opts.labelOpt = 'yaxis' // 横向轴线
    let result = drawAxis(context, axis, chartRegion, opts, config)
    
    // 记录图表长度和视图宽度
    opts.chartWidth = result.chartWidth
    opts.chartViewportWidth = result.region.width
    let bars = []
    let barHalfWidth = barWidth >> 1
    let {width, height, bottom} = result.region
    let yMax = result.yMax
    // xLabels = result.xLabels
    let offsetX = result.region.left
    let barWp = 1 / (series.length || 1)
    let offsetWp = barWp / 2
    for (let [i, item] of Object.entries(series)) {
        if (item instanceof Array) item.data = item[1]
        bars.push({
            color: item.color || opts.color || 'red',
            data: [(i * barWp + offsetWp) * result.chartWidth + offsetX - barHalfWidth, bottom - item.data / yMax * height, barHalfWidth * 2, item.data / yMax * height]
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