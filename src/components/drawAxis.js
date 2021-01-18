import { measureText, regionFrom } from './utils'

/**
 * @param {[[x, y]]} series 
 * @param {{top, left, width, height, bottom, right}} region 
 * @param {{textpadding}} opts
 * @return {[]} result
 */
export function calcAxisSeries(series, opts={}) {
    let result = {}
    let n = series.length
    let xLabelNum = opts.xMarks || 10
    let yLabelNum = opts.yMarks || 5
    let xRange = opts.xRange || 10
    let yRange = opts.yRange || 10
    let yMax = 10
    let xMax = 10
    let xLabels = []
    let yLabels = []
    
    if (n > 0) {
        xMax = opts.xMax || series[n - 1][0]
        xRange = opts.xMax || series[n - 1][0]
        yMax = yRange = opts.yRange || Math.max(...series.map(item => item[1]))
        let xUnit = (xRange + series[0][0]) / xLabelNum
        let yUnit = yRange / yLabelNum
        xUnit > 1 ? xUnit = Math.ceil(xUnit) : xUnit.toFixed(2)
        yUnit > 1 ? yUnit = Math.ceil(yUnit) : yUnit.toFixed(2)
        // console.log(xUnit, yUnit)
        for (let i = 0; i < xLabelNum; i++) {
            let val = i * xUnit
            xLabels.push([val / xMax, xUnit > 1 ? val : val.toFixed(2)])
        }
        for (let i = 0; i < yLabelNum; i++) {
            let val = i * yUnit
            yLabels.push([val / yMax, yUnit > 1 ? (i * yUnit) : val.toFixed(2)])
        }
    }
    
    let xLabelHeight = 20
    let yLabelWidth = yLabels.reduce((a, b) => Math.max(measureText(b[1]), a), 0)
    return {
        xLabels,
        yLabels,
        xLabelHeight,
        yLabelWidth,
        xMax,
        yMax
    }
}
export function drawAxis(context, axis, region, opts, config) {
    let markLen = 3
    let textPadding = 1
    let lineWidth = 1
    // let axis = calcAxisSeries(series, region, opts)
    console.log(axis)
    let xlabelHeight = Math.ceil(axis.xLabelHeight) + markLen + textPadding
    let ylabelWidth = Math.ceil(axis.yLabelWidth) + markLen + textPadding
    
    context.lineWidth = lineWidth
    context.strokeStyle = 'gray'
    context.beginPath()
    context.moveTo(region.left + ylabelWidth, region.top)
    context.lineTo(region.left + ylabelWidth, region.bottom - xlabelHeight)
    context.lineTo(region.right, region.bottom - xlabelHeight)
    context.stroke()
    let xLabels = axis.xLabels
    let yLabels = axis.yLabels
    let cWidth = region.width - ylabelWidth
    let cHeight = region.height - xlabelHeight
    context.textAlign = 'center'
    context.textBaseline = 'top'
    for (let item of xLabels) {
        context.beginPath()
        context.moveTo(region.left + ylabelWidth + cWidth * item[0], region.bottom - xlabelHeight)
        context.lineTo(region.left + ylabelWidth + cWidth * item[0], region.bottom - xlabelHeight + markLen)
        context.stroke()
        context.fillText(item[1], region.left + ylabelWidth + cWidth * item[0], region.bottom - xlabelHeight + markLen + textPadding)
    }

    context.textAlign = 'right'
    context.textBaseline = 'middle'
    for (let item of yLabels) {
        context.beginPath()
        context.moveTo(region.left + ylabelWidth, region.bottom - xlabelHeight - item[0] * cHeight)
        context.lineTo(region.left + ylabelWidth - markLen, region.bottom - xlabelHeight - item[0] * cHeight)
        context.stroke()
        context.fillText(item[1], region.left + ylabelWidth - markLen - textPadding, region.bottom - xlabelHeight - item[0] * cHeight)
    }
    region = regionFrom(region, {
        top: 0,
        left: ylabelWidth + lineWidth,
        width: cWidth - lineWidth,
        height: cHeight - lineWidth
    })
    return {
        region
    }
}