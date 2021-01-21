import { drawAxis, calcAxisSeries } from './drawAxis'
import { getRelativeRegion, darwBars } from './utils'
import drawLegend from './drawLegend'

/**
 * 
 * @param {*} context 
 * @param {*} series 
 * @param {{barWidth, legends}} opts 
 * @param {*} config 
 */
export default function drawStackbarChart(context, series, opts, config) {
    let xLabels = []
    let arr = series.map(item => {
        xLabels.push(item.label)
        return [item.label, item.data.reduce((a, b) => a + b, 0)]
    })
    opts.xLabels = xLabels
    let axis = calcAxisSeries(arr, opts)
    // let region = getRelativeRegion(opts.width, opts.height)
    let padding = config.padding || 0
    let bottomAreaHeight = 20
    let chartRegion = getRelativeRegion(opts.width, opts.height, padding, {bottom: bottomAreaHeight, left: 0})
    let result = drawAxis(context, axis, chartRegion, opts, config)
    console.log(result)
    let bars = []
    let barHalfWidth = (opts.barWidth || 16) >> 1
    let {width, height, bottom} = result.region
    let yMax = result.yMax
    xLabels = result.xLabels
    for (let [i, item] of Object.entries(series)) {
        let total = 0
        for (let [j, num] of Object.entries(item.data)) {
            total += num
            bars.push({
                color: config.colors[j % config.colors.length],
                data: [xLabels[i][0] - barHalfWidth, bottom - total / yMax * height, barHalfWidth * 2, num / yMax * height]
            })
        }
    }
    console.log(bars)
    darwBars(context, bars)

    // 绘制图示
    if (opts.legends && opts.legends.length > 0) {
        let legends = opts.legends.map((item, index) => {
            return {
                color: config.colors[index % config.colors.length],
                label: item
            }
        })
        let legendRegion = getRelativeRegion(opts.width, opts.height, 0, {left: 30, top: opts.height - bottomAreaHeight})
        drawLegend(context, legends, legendRegion, {markWidth: 12, legendFontsize: 14, shape: 'rect'})
    }
    
}