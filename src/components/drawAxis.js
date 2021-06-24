import { measureText, regionFrom, onePixelLine } from './utils'

/**
 * @param {[[x, y]]} series 
 * @param {{top, left, width, height, bottom, right}} region 
 * @param {{textpadding}} opts
 * @return {[]} result
 */
export function calcAxisSeries(series, opts={}, config={}) {
    let result = {}
    let n = series.length
    let xLabelNum = Number.isNaN(parseInt(opts.xLabelNum)) ? 10 : parseInt(opts.xLabelNum)
    let yLabelNum = Number.isNaN(parseInt(opts.yLabelNum)) ? 5 : parseInt(opts.yLabelNum)
    let xRange = opts.xRange || 10
    let yRange = opts.yRange || 10
    let yMax = opts.yMax || 10
    let xMax = opts.xMax || 10
    let xLabels = []
    let yLabels = []
    let xLabelFormat = typeof opts.xLabelFormat === 'function' ? opts.xLabelFormat : (s) => s
    let yLabelFormat = typeof opts.yLabelFormat === 'function' ? opts.yLabelFormat :  s => s
    let xLabelAlign = opts.xLabelAlign || 'center'
    let yLabelAlign = opts.yLabelAlign || 'end'
    let xOrigin = 0
    let yMin = 0
    if (opts.xLabels) {
        xLabelNum = opts.xLabels.length
        let labelWP = 1 / (xLabelNum || 1)
        let offset;
        switch (xLabelAlign) {
            case 'start':
                offset = 0
                break
            case 'end':
                offset = labelWP
                break
            default:
                offset = labelWP / 2
                break
        }
        for (let i = 0; i < xLabelNum; i++) {
            let val = i * labelWP + offset
            xLabels.push([val, xLabelFormat(opts.xLabels[i])])
        }
    } else if (n > 0) {
        xOrigin = series[0][0]
        xMax = opts.xMax || series[n - 1][0]
        xRange = xMax - xOrigin
        
        let labelWP = 1 / (xLabelNum || 1)
        let xUnit = xRange * labelWP
        let offset;
        xLabelAlign = opts.xLabelAlign || 'start'
        switch (xLabelAlign) {
            case 'start':
                offset = 0
                break
            case 'end':
                offset = labelWP
                break
            default:
                offset = labelWP / 2
                break
        }
        xUnit > 1 ? xUnit = Math.round(xUnit) : xUnit.toFixed(2)
        for (let i = 0; i < xLabelNum; i++) {
            let xp = i * labelWP + offset
            let val = xp * xRange + xOrigin
            xLabels.push([xp, xLabelFormat((xUnit > 1 ? val.toFixed(1) : val.toFixed(2)))])
        }
    }

    if (opts.yLabels) {
        yLabelNum = opts.yLabels.length
        let labelHP = 1 / (yLabelNum || 1)
        let offset =  0
        switch (yLabelAlign) {
            case 'start':
                offset = 0
                break
            case 'center':
                offset = labelHP / 2
                break
            default:
                offset = labelHP
                break
        }
        for (let i = 0; i < yLabelNum; i++) {
            yLabels.push([i * labelHP + offset, yLabelFormat(opts.yLabels[i])])
        }
    } else if (n > 0) {
        let dataYmax = Math.max(...series.map(item => item[1]))
        yMax = opts.yMax || dataYmax
        yMax = dataYmax > yMax ? dataYmax : yMax
        yMin = opts.yMin !== undefined ? opts.yMin : Math.min(...series.map(item => item[1]))
        let yUnit = yMax / (yLabelNum || 1)
        yUnit >= 1 ? yUnit = Math.ceil(yUnit) : yUnit.toFixed(2)
        if (opts.yValType === 'integer') {
            yUnit = Math.ceil(yUnit)
        }
        yMax = yUnit * (yLabelNum || 1)
        yRange = yMax - yMin
        // console.log(xUnit, yUnit)
        for (let i = 1; i <= yLabelNum; i++) {
            let val = i * yUnit
            yLabels.push([val / yMax, yLabelFormat(('' + yUnit).split('.').length == 1 ? (i * yUnit) : val.toFixed(2))])
        }
    }
    
    let xLabelHeight = 20
    let fontSize = opts.axisFontSize || config.axisFontSize || 10
    let yLabelWidth = yLabels.reduce((a, b) => Math.max(measureText(b[1], fontSize), a), 0)
    return {
        xLabels,
        yLabels,
        xLabelHeight,
        yLabelWidth,
        xMax,
        yMax,
        xOrigin,
        xRange,
        yRange,
        yMin,
        empty: n == 0
    }
}

/**
 * 
 * @param {*} context 
 * @param {*} axis 
 * @param {*} region 
 * @param {{axisColor, axisLabelColor, axisFontSize}} opts 
 * @param {*} config 
 */
export function drawAxis(context, axis, region, opts, config) {
    let markLen = 3
    let textPadding = 4
    let lineWidth = 1
    let fontSize = opts.axisFontSize || config.axisFontSize || 10
    // let axis = calcAxisSeries(series, region, opts)
    // console.log(axis)
    let xlabelHeight = Math.ceil(axis.xLabelHeight) + markLen + textPadding
    let ylabelWidth = Math.ceil(axis.yLabelWidth) + markLen + textPadding
    context.font = `${fontSize}px sans-serif`
    context.lineWidth = lineWidth
    context.strokeStyle = opts.axisColor || 'gray'
    // context.beginPath()
    // // context.moveTo(region.left + ylabelWidth, region.top)
    // context.moveTo(region.left + ylabelWidth, region.bottom - xlabelHeight)
    // context.lineTo(region.right, region.bottom - xlabelHeight)
    // context.stroke()
    // onePixelLine(context, region.left + ylabelWidth, region.bottom - xlabelHeight, region.right, region.bottom - xlabelHeight, opts.dpr)
    let cWidth = region.width - ylabelWidth
    let cHeight = region.height - xlabelHeight - 10
    let xLabelNum = axis.xLabels.length || 1
    let xLabelWidth = cWidth / xLabelNum
    let xLabelMinWidth = opts.xLabelMinWidth || xLabelWidth
    let xLabels;
    let chartWidth = cWidth
    if (xLabelWidth < xLabelMinWidth) {
        let offset = xLabelNum * xLabelMinWidth * ((axis.xLabels[0] && axis.xLabels[0][0]) || 0)
        chartWidth = xLabelMinWidth * xLabelNum
        xLabelWidth = xLabelMinWidth
        xLabels = axis.xLabels.map((item, index) => {
            return [Math.round(region.left + ylabelWidth + index * xLabelMinWidth + offset), item[1]]
        })
    } else {
        xLabels = axis.xLabels.map(item => {
            return [Math.round(region.left + ylabelWidth + cWidth * item[0]), item[1]]
        })
    }
    
    let yLabels = axis.yLabels.map(item => {
        return [Math.round(region.bottom - xlabelHeight - item[0] * cHeight), item[1]]
    })

    let showXlabel = opts.labelOpt ? /xl/.test(opts.labelOpt) : true
    context.fillStyle = opts.axisLabelColor || config.axisLabelColor || 'gray'
    context.textAlign = 'center'
    context.textBaseline = 'top'
    if (showXlabel) {
        let xOffset = opts.xOffset || 0
        for (let item of xLabels) {
            // context.beginPath()
            // context.moveTo(item[0], region.bottom - xlabelHeight)
            // context.lineTo(item[0], region.bottom - xlabelHeight + markLen)
            // context.stroke()
            // 过滤超出画布的部分
            let left = item[0] - xLabelWidth / 2 + xOffset
            let right = left + xLabelWidth
            if (right < region.left + ylabelWidth) {
                continue
            }
            if (left > region.left + ylabelWidth + cWidth) {
                break
            }
            onePixelLine(context, item[0], region.bottom - xlabelHeight, item[0], region.bottom - xlabelHeight + markLen, opts.dpr)
            context.fillText(item[1], item[0], region.bottom - xlabelHeight + markLen + textPadding)
        }
    }

    let showYaxis = opts.labelOpt ? /yaxis/.test(opts.labelOpt) : true
    let showYlabel = opts.labelOpt ? /yl/.test(opts.labelOpt) : true
    context.strokeStyle = opts.axisColor || config.axisColor || '#cccccc'
    context.textAlign = 'right'
    context.textBaseline = 'middle'
    for (let item of yLabels) {
        // context.beginPath()
        // context.moveTo(region.left + ylabelWidth - markLen, item[0])
        // context.lineTo(region.right, item[0])
        // context.stroke()
        showYaxis && onePixelLine(context, region.left + ylabelWidth, item[0], region.right, item[0], opts.dpr)
        showYlabel && context.fillText(item[1], region.left + ylabelWidth - markLen - textPadding, item[0])
    }
    showYaxis && onePixelLine(context, region.left + ylabelWidth, region.bottom - xlabelHeight, region.right, region.bottom - xlabelHeight, opts.dpr)

    let emptyHint = opts.emptyHint || config.emptyHint
    if (axis.empty && emptyHint) {
        context.textBaseline = 'middle'
        context.textAlign = 'center'
        context.fillStyle = opts.axisLabelColor || config.axisLabelColor || 'gray'
        context.strokeStyle = opts.axisLabelColor || config.axisLabelColor || 'gray'
        context.font = `${fontSize}px sans-serif`
        context.fillText(emptyHint, ylabelWidth + (cWidth >> 1), cHeight >> 1)
    }
    region = regionFrom(region, {
        top: 10,
        left: ylabelWidth,
        width: cWidth,
        height: cHeight
    })
    return {
        region,
        ...axis,
        xLabels,
        yLabels,
        chartWidth
    }
}