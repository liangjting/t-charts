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
    let xLabelNum = opts.xLabelNum || 10
    let yLabelNum = opts.yLabelNum || 5
    let xRange = opts.xRange || 10
    let yRange = opts.yRange || 10
    let yMax = opts.yMax || 10
    let xMax = opts.xMax || 10
    let xLabels = []
    let yLabels = []
    if (opts.xLabels) {
        xLabelNum = opts.xLabels.length
        let labelWP = 1 / (xLabelNum || 1)
        let offset = labelWP / 2
        for (let i = 0; i < xLabelNum; i++) {
            let val = i * labelWP + offset
            xLabels.push([val, opts.xLabels[i]])
        }
    } else if (n > 0) {
        xMax = opts.xMax || series[n - 1][0]
        xRange = opts.xMax || series[n - 1][0]
        let xUnit = (xRange + series[0][0]) / xLabelNum
        xUnit > 1 ? xUnit = Math.ceil(xUnit) : xUnit.toFixed(2)
        for (let i = 0; i < xLabelNum; i++) {
            let val = i * xUnit
            xLabels.push([val / xMax, xUnit > 1 ? val : val.toFixed(2)])
        }
    }

    if (opts.yLabels) {
        yLabelNum = opts.yLabels.length
        let labelHP = 1 / (yLabelNum || 1)
        let offset = labelHP / 2
        for (let i = 0; i < yLabelNum; i++) {
            yLabels.push([i * labelHP + offset, opts.yLabels[i]])
        }
    } else if (n > 0) {
        yMax = yRange = opts.yMax || Math.max(...series.map(item => item[1]))
        let yUnit = yRange / yLabelNum
        yUnit > 1 ? yUnit = Math.ceil(yUnit) : yUnit.toFixed(2)
        // console.log(xUnit, yUnit)
        for (let i = 1; i <= yLabelNum; i++) {
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
    let textPadding = 4
    let lineWidth = 1
    // let axis = calcAxisSeries(series, region, opts)
    console.log(axis)
    let xlabelHeight = Math.ceil(axis.xLabelHeight) + markLen + textPadding
    let ylabelWidth = Math.ceil(axis.yLabelWidth) + markLen + textPadding
    
    context.lineWidth = lineWidth
    context.strokeStyle = 'gray'
    context.beginPath()
    // context.moveTo(region.left + ylabelWidth, region.top)
    context.moveTo(region.left + ylabelWidth, region.bottom - xlabelHeight)
    context.lineTo(region.right, region.bottom - xlabelHeight)
    context.stroke()
    
    let cWidth = region.width - ylabelWidth
    let cHeight = region.height - xlabelHeight - 10
    let xLabels = axis.xLabels.map(item => {
        return [Math.round(region.left + ylabelWidth + cWidth * item[0]), item[1]]
    })
    let yLabels = axis.yLabels.map(item => {
        return [Math.round(region.bottom - xlabelHeight - item[0] * cHeight), item[1]]
    })
    context.textAlign = 'center'
    context.textBaseline = 'top'
    for (let item of xLabels) {
        context.beginPath()
        context.moveTo(item[0], region.bottom - xlabelHeight)
        context.lineTo(item[0], region.bottom - xlabelHeight + markLen)
        context.stroke()
        context.fillText(item[1], item[0], region.bottom - xlabelHeight + markLen + textPadding)
    }
    context.strokeStyle = '#cccccc'
    context.textAlign = 'right'
    context.textBaseline = 'middle'
    for (let item of yLabels) {
        context.beginPath()
        context.moveTo(region.left + ylabelWidth - markLen, item[0])
        context.lineTo(region.right, item[0])
        context.stroke()
        context.fillText(item[1], region.left + ylabelWidth - markLen - textPadding, item[0])
    }
    region = regionFrom(region, {
        top: 10,
        left: ylabelWidth + lineWidth,
        width: cWidth - lineWidth,
        height: cHeight - lineWidth
    })
    return {
        region,
        ...axis,
        xLabels,
        yLabels
    }
}