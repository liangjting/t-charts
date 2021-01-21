import { measureText, absoluteCoord } from '@/components/utils'

/**
 * 
 * @param {*} context 
 * @param {*} series 
 * @param {*} region 
 * @param {{legendPadding, shape}} opts 
 */
export default function drawLegend(context, series, region, opts) {
    let nums = series.length
    let { width, height } = region
    let markWidth = opts.markWidth || 10
    let legendFontsize = opts.legendFontsize || 14
    let legendList = []
    let widthTotal = 0
    let padding = opts.legendPadding || 20
    let shape = opts.shape || 'circle'
    series.forEach(item => {
        let w = markWidth + 2 + measureText(item.label, legendFontsize)
        legendList.push({
            color: item.color,
            label: item.label,
            offsetX: widthTotal,
            width: w
        })
        widthTotal += w + padding
    })

    context.font = `${legendFontsize}px sans-serif`
    context.textBaseline = 'middle'
    context.textAlign = 'left'
    for (let item of legendList) {
        let center = [item.offsetX + markWidth, region.height >> 1]
        let textCoord = [item.offsetX + 1.5 *  markWidth + 4, region.height >> 1]
        context.fillStyle = item.color
        if (shape == 'circle') {
            context.beginPath()
            context.arc(...absoluteCoord(center, region), markWidth >> 1, 0, 2 * Math.PI)
            context.fill()
        } else {
            let p = absoluteCoord(center, region)
            context.fillRect(p[0] - (markWidth >> 1), p[1] - (markWidth >> 1), markWidth, markWidth)
        }

        context.fillStyle = 'gray'
        context.fillText(item.label, ...absoluteCoord(textCoord, region))
    }
}