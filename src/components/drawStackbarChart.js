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
    let separateBar = opts.separateBar || false
    let barWidth = opts.barWidth || 16
    let barHalfWidth = parseInt(barWidth / 2)
    let padding = config.padding || 0
    let bottomAreaHeight = 20
    let colors = opts.colors || config.colors
    let chartRegion = getRelativeRegion(opts.width, opts.height, padding, {bottom: bottomAreaHeight, left: 0})
    let barsPerItem = (series[0] && series[0].data.length) || 1
    let barMargin = opts.barMargin || 0
    if (separateBar) {
        opts.xLabelMinWidth = opts.xLabelMinWidth || (barWidth * (barsPerItem + 1) + barMargin * (barsPerItem - 1))
    }


    let axis = calcAxisSeries(arr, opts)
    let result = drawAxis(context, axis, chartRegion, opts, config)
    // console.log(result)
    let bars = []
    let {width, height, bottom} = result.region
    let yMax = result.yMax
    xLabels = result.xLabels
    if (separateBar) {
        let offset = (barWidth * barsPerItem + barMargin * (barsPerItem - 1)) / 2
        for (let [i, item] of Object.entries(series)) {
            let total = 0
            for (let [j, num] of Object.entries(item.data)) {
                total += num
                bars.push({
                    color: colors[j % colors.length],
                    data: [xLabels[i][0] - offset + j * (barWidth + barMargin), bottom - num / yMax * height, barHalfWidth * 2, num / yMax * height]
                })
            }
        }
    } else {
        for (let [i, item] of Object.entries(series)) {
            let total = 0
            for (let [j, num] of Object.entries(item.data)) {
                total += num
                bars.push({
                    color: colors[j % colors.length],
                    data: [xLabels[i][0] - barHalfWidth, bottom - total / yMax * height, barHalfWidth * 2, num / yMax * height]
                })
            }
        }
    }
    // console.log(bars)
    darwBars(context, bars)

    // 绘制图示
    if (opts.legends && opts.legends.length > 0) {
        let legends = opts.legends.map((item, index) => {
            return {
                color: colors[index % colors.length],
                label: item
            }
        })
        let legendRegion = getRelativeRegion(opts.width, opts.height, 0, {left: 30, top: opts.height - bottomAreaHeight})
        drawLegend(context, legends, legendRegion, {markWidth: 12, legendFontsize: 14, shape: 'rect', ...opts})
    }
    
}