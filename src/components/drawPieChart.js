import { measureText, getRelativeRegion, absoluteCoord } from '@/components/utils'
import drawLegend from './drawLegend'
/**
 * series: [
 *     { color, label, data}
 * ]
 */

function crossProduct([ax1, ay1], [ax2, ay2], [bx1, by1], [bx2, by2]) {
    let v1 = [ax2- ax1, ay2 - ay1]
    let v2 = [bx2 - bx1, by2 - by1]
    return v1[0] * v2[1] - v1[1] * v2[0]
}
function isAcuteAngle([ax1, ay1], [ax2, ay2], [bx1, by1], [bx2, by2]) {
    let v1 = [ax2- ax1, ay2 - ay1]
    let v2 = [bx2 - bx1, by2 - by1]
    return (v1[0] * v2[0] + v1[1] * v2[1]) >= 0
}

function getXpoint([ax1, ay1], [ax2, ay2], [bx1, by1], y) {
    let k = -(ay2 - ay1) / (ax2 - ax1)
    let b = by1 - (k * bx1)
    let x = (y - b) / k
    return x
}
function distance([x1, y1], [x2, y2]) {
    return Math.sqrt(Math.pow(x2- x1, 2) + Math.pow(y2 - y1, 2))
}
 function adjustLabels({labelsLeftQuarter, labelsRightQuarter}, center, pieRadius, opts) {
    let textPadding = 2
    let textSize = opts.labelSize || 10
    let quarters = [0, 0, 0, 0] //顺时针
    let padding = textSize >> 1
    let labelMargin = opts.labelMargin || 1
    textSize += labelMargin
    
    let quarterHeight = opts.height
    let labelLen = labelsRightQuarter.length
    for (let i = 0; i < labelLen; i++) {
        let item = labelsRightQuarter[i]
        let [xEnd,yEnd] = item.lineEnd
        // let [xDirect, yDirect] = item.end
        let d
        if (yEnd < padding) {
            yEnd = padding
        }
        if (i == 0) {
            if (quarterHeight - (labelLen - i - 1) * textSize - yEnd <= 0) {
                yEnd = padding
            }
        } else {
            let prev = labelsRightQuarter[i - 1]
            d = (yEnd - prev.lineEnd[1])
            // console.log(i, prev.lineEnd[1], yEnd, d)
            
            let restHeight = quarterHeight - (labelLen - i - 1) * textSize - yEnd - padding
            // console.log('restH: ' + restHeight, quarterHeight)
            if (restHeight <= 0) {
                // console.log('oversize', restHeight)
                yEnd += restHeight
                if (yEnd < prev.lineEnd[1] || Math.abs(yEnd - prev.lineEnd[1] < textSize)) {
                    yEnd = prev.lineEnd[1] + textSize
                }
            } else if (d < textSize) {
                yEnd = prev.lineEnd[1] + textSize
            }
        }
        // console.log(i, yEnd, prev.lineEnd[1], d)
        if (distance(center, [xEnd, yEnd]) <= pieRadius) {
            // console.log('text in the pie')
            xEnd = Math.sqrt(pieRadius * pieRadius - (yEnd - center[1]) * (yEnd - center[1])) + center[0]
        }
        item.lineEnd = [xEnd + textSize, yEnd]
        item.textStart = [ xEnd + textSize + textPadding, yEnd]
    }
    // let count = 0
    // labelsRightQuarter.forEach(item => {
    //     if (!isAcuteAngle(center, item.lineStart, item.lineStart, item.lineEnd)) {
    //         // 需要调整
    //         count++
    //         let x = getXpoint(center, item.lineStart, item.lineStart, item.lineEnd[1])
    //         console.log('x', x)
    //         // item.lineEnd[0] += x - center[0]
    //         // item.textStart[0] += x - center[0]
    //     }
    // })

    labelsLeftQuarter = labelsLeftQuarter.reverse()
    labelLen = labelsLeftQuarter.length
    for (let i = 0; i < labelLen; i++) {
        let item = labelsLeftQuarter[i]
        let [xEnd,yEnd] = item.lineEnd
        // let [xDirect, yDirect] = item.end
        let d
        if (yEnd < padding) {
            yEnd = padding
        }
        let restHeight = quarterHeight - (labelLen - i - 1) * textSize - yEnd - padding
        if (i == 0) {
            if (restHeight <= 0) {
                yEnd = padding
            }
        } else {
            let prev = labelsLeftQuarter[i - 1]
            d = (yEnd - prev.lineEnd[1])
            // console.log(i, prev.lineEnd[1], yEnd, d)
            // console.log('restH: ' + restHeight, quarterHeight)
            if (restHeight <= 0) {
                // console.log('oversize', restHeight)
                yEnd += restHeight
                if (yEnd < prev.lineEnd[1] || Math.abs(yEnd - prev.lineEnd[1] < textSize)) {
                    yEnd = prev.lineEnd[1] + textSize
                }
            } else if (d < textSize) {
                // console.log('collap')
                yEnd = prev.lineEnd[1] + textSize
            }
        }
        // console.log(i, yEnd, prev.lineEnd[1], d)
        
        // item.end = [xDirect, yDirect]
        if (distance(center, [xEnd, yEnd]) <= pieRadius) {
            console.log('text in the pie')
            xEnd = center[0] - Math.sqrt(pieRadius * pieRadius - (yEnd - center[1]) * (yEnd - center[1]))
            console.log(xEnd)
        }
        item.lineEnd = [xEnd - textSize, yEnd]
        item.textStart = [ xEnd - textSize - textPadding, yEnd]
        // item.lineEnd = [xDirect > 0 ? (xEnd + textSize) : (xEnd - textSize), yEnd]
        // item.textStart = [ xDirect > 0 ? (item.textStart[0] + textSize) : (item.textStart[0] - textSize), yEnd]
    }
    return [...labelsRightQuarter, ...labelsLeftQuarter]
 }

/**
 * 
 * @param {*} series 
 * @param {{labelSize, labelMargin, labelFormat, labelLine}} opts 
 * @param {*} config 
 * @param {*} context 
 */
export default function drawPieChart(context, series, opts, config) {
    let sum = 0
    let { width, height } = opts
    let legends = []
    let bottomAreaHeight = 0
    let textPadding = 2
    let labelSize = opts.labelSize || 10
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
    let ratio = 1.3 // 用于控制标签显示相对于饼状图半径的距离比例
    let region = getRelativeRegion(width, height, 0, {bottom: bottomAreaHeight})
    let pieRadius = parseInt(Math.min(region.height, region.width) / 2 / ratio)
    let center = absoluteCoord([region.width >> 1 , region.height >> 1], region)
    console.log(pieRadius, center)

    let start = 1.5 * Math.PI
    context.strokeStyle = '#ffffff'
    context.lineWidth = 1 / opts.dpr
    let labelsLeftQuarter = []
    let labelsRightQuarter = []
    for (let item of series) {
        let halfAngle = Math.PI * item.data / sum
        context.fillStyle = item.color
        context.beginPath()
        context.moveTo(...center)
        context.arc(...center, pieRadius, start, 2 * halfAngle + start)
        context.closePath()
        context.fill()
        context.stroke()
        let angle = start + halfAngle
        start += 2 * halfAngle

        let [xStart, yStart] = [pieRadius * Math.cos(angle), pieRadius * Math.sin(angle)]
        let [xEnd, yEnd] = [ratio * pieRadius * Math.cos(angle), ratio * pieRadius * Math.sin(angle)]
        if (xEnd >= 0) {
            // 右区间
            labelsRightQuarter.push({
                // start: [xStart, yStart],
                // end: [xEnd, yEnd],
                lineStart: [xStart + center[0], yStart + center[1]],
                lineEnd: [xEnd + center[0], yEnd + center[1]],
                color: item.color,
                label: opts.labelFormat ? opts.labelFormat(item.label, item.data, sum) : item.label,
                textAlign: xEnd >= 0 ? 'left' : 'right',
                // textStart: [xEnd + textPadding + center[0], yEnd + center[1]]
            })
        } else {
            // 左区间
            labelsLeftQuarter.push({
                // start: [xStart, yStart],
                // end: [xEnd, yEnd],
                lineStart: [xStart + center[0], yStart + center[1]],
                lineEnd: [xEnd + center[0], yEnd + center[1]],
                color: item.color,
                label: opts.labelFormat ? opts.labelFormat(item.label, item.data, sum) : item.label,
                textAlign: xEnd >= 0 ? 'left' : 'right',
                // textStart: [xEnd - textPadding + center[0], yEnd + center[1]]
            })
        }
    }

    let labels = adjustLabels({labelsRightQuarter, labelsLeftQuarter}, center, pieRadius, opts)
    console.log(labels)
    context.fillStyle = 'black'
    context.lineWidth = 1
    context.textBaseline = 'middle'
    context.font = `${labelSize}px sans-serif`

    labels.forEach((item) => {
        context.fillStyle = item.color
        context.strokeStyle = item.color
        context.beginPath()
        context.moveTo(...item.lineStart)
        if (opts.labelLine == 'straight') {
            context.lineTo(...item.lineEnd)
        } else {
            let cpx = (item.lineStart[0] + item.lineEnd[0]) / 2
            let cpy = item.lineEnd[1] + (item.lineEnd[1] >= center[1] ? (labelSize / 2) : (-labelSize / 2))
            context.quadraticCurveTo(cpx, cpy, ...item.lineEnd)
        }
        context.stroke()
        context.textAlign = item.textAlign
        context.fillText(item.label, ...item.textStart)
    })
    return {
        pieRadius,
        center,
        region
    }
    // 绘制图示
    // if (legends.length > 0) {
    //     legends = legends.map(item => {
    //         item.label = item.label
    //         return item
    //     })
    //     let legendRegion = getRelativeRegion(opts.width, opts.height, 0, {left: 30, top: opts.height - bottomAreaHeight})
    //     drawLegend(context, legends, legendRegion, {markWidth: 12, legendFontsize: 14, shape: 'rect', legendPadding: 10})
    // }
    
}