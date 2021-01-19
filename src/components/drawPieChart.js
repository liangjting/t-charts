import { measureText, getRelativeRegion, absoluteCoord } from '@/components/utils'
import drawLegend from './drawLegend'
/**
 * series: [
 *     { color, label, data}
 * ]
 */

/**
 * 
 * @param {*} series 
 * @param {*} opts 
 * @param {*} config 
 * @param {*} context 
 */
export default function drawPieChart(context, series, opts, config) {
    let sum = 0
    let { width, height } = opts
    let legends = []
    let bottomAreaHeight = 30
    series.forEach((item, index) => {
        if (item.color == undefined) {
            item.color = config.colors[index % config.colors.length]
        }
        sum += item.data
        legends.push({
            color: item.color,
            label: item.label,
            data: item.data
        })
    })

    let region = getRelativeRegion(width, height, 5, {bottom: bottomAreaHeight})
    let pieRadius = opts.pieRadius || Math.min(region.height, region.width) >> 1
    let center = absoluteCoord([region.width >> 1 , region.height >> 1], region)
    console.log(pieRadius, center)

    let start = 0
    context.strokeStyle = '#ffffff'
    for (let item of series) {
        context.fillStyle = item.color
        context.beginPath()
        context.moveTo(...center)
        context.arc(...center, pieRadius, start, 2 * Math.PI * item.data / sum + start)
        context.closePath()
        context.fill()
        context.stroke()
        start += 2 * Math.PI * item.data / sum
    }

    // 绘制图示
    if (legends.length > 0) {
        legends = legends.map(item => {
            item.label = item.label
            return item
        })
        let legendRegion = getRelativeRegion(opts.width, opts.height, 0, {left: 30, top: opts.height - bottomAreaHeight})
        drawLegend(context, legends, legendRegion, {markWidth: 12, legendFontsize: 14, shape: 'rect', legendPadding: 10})
    }
    
}