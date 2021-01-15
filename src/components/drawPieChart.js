import { measureText, getRelativeRegion, absoluteCoord } from '@/components/utils'
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
    series.forEach((item, index) => {
        if (item.color == undefined) {
            item.color = config.colors[index % config.colors.length]
        }
        sum += item.data
    })

    let region = getRelativeRegion(width, height, 5, {})
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
    
}