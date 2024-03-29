import { measureText, getRelativeRegion, absoluteCoord } from '@/components/utils'
import drawLegend from './drawLegend'
import { drawAxis, calcAxisSeries} from './drawAxis'

function toPercentage(arrData, arrMax=[]) {
    let result = []
    for (let [index, max] of Object.entries(arrMax)) {
        result.push(arrData[index] / max)
    }
    // console.log(result)
    return result
}

function percentage2Coords(xp, yp, {top, left, width, height}) {
    return [xp * width + left, yp * height + top]
}

function fillRectP(context, xp, yp, wp, hp, {left, top, width, height}) {
    context.fillRect(xp * width + left, yp * height + top, wp * width, hp * height)
}
function drawLoadChart(chart, config, opts={}) {
    let { width, height } = chart.opts
    let context = chart.context
    let padding = config.padding || 5
    let paddingObj = {left: 0, right: 0, bottom: 0, top: 0};
    opts.paddingObj && (paddingObj = {...paddingObj,...opts.paddingObj})
    let textPadding = config.textPadding || 0
    let loadChartData = chart.chartData.data || []
    let bottomAreaHeight = chart.opts.legend === false ? 20 : 40
    let mergeChart = opts.mergeChart || false
    let colors = opts.colors || config.colors
    let fontSize = opts.axisFontSize || config.axisFontSize || 12
    let leftArea = 40
    let xLabelFormat = chart.opts.xLabelFormat
    let xLabelNum = chart.opts.xLabelNum || 5
    let labelPadding = paddingObj.left || (xLabelFormat ? 0.5 * Math.max(context.measureText(xLabelFormat(0)).width, context.measureText(xLabelFormat(xLabelNum)).width): 5)
    labelPadding = labelPadding > 0.15 * width ? 0.15 * width : labelPadding
    let chartArea = getRelativeRegion(width, height, padding, {bottom: bottomAreaHeight + paddingObj.bottom, left: labelPadding, right: labelPadding})
    // console.log(chartArea)
    context.clearRect(0, 0, width, height)
    
    context.lineWidth = 1
    context.strokeStyle = '#eeeeee'
    let offset = 1 / loadChartData.length
    let barHeight = opts.barHeight || offset
    let maxSpan = 0
    let ox = Infinity
    let empty = true
    // draw axis
    context.strokeStyle = 'gray'
    context.beginPath()
    context.moveTo(chartArea.left, chartArea.bottom + 1)
    context.lineTo(chartArea.right, chartArea.bottom + 1)
    context.stroke()
    for (let i = 0; i < loadChartData.length; i++) {
        // if (i == 0) {
        //     context.strokeStyle = 'gray'
        //     context.beginPath()
        //     context.moveTo(chartArea.left, chartArea.bottom - i * offset * chartArea.height + 1)
        //     context.lineTo(chartArea.right, chartArea.bottom - i * offset * chartArea.height + 1)
        //     context.stroke()
        // } else 
        if (!mergeChart && i > 0) {
            context.strokeStyle = '#eeeeee'
            context.beginPath()
            context.moveTo(chartArea.left, chartArea.bottom - i * offset * chartArea.height + 1)
            context.lineTo(chartArea.right, chartArea.bottom - i * offset * chartArea.height + 1)
            context.stroke()
        }
        let list = loadChartData[i].data
        if (list.length > 0) {
            maxSpan = Math.max(list[list.length - 1][1], maxSpan)
            ox = Math.min(list[0][0], ox)
            empty = false
        }
    }
    let scale = 1
    maxSpan -= ox
    while (maxSpan / scale > 14) {
        scale++
    }
    let xAxisOffset = parseInt(chartArea.width / (maxSpan / scale))
    xAxisOffset = (chartArea.width / (xLabelNum))
    // console.log(xAxisOffset)
    context.textBaseline = 'top'
    context.textAlign = 'center'
    context.fillStyle = opts.axisLabelColor || config.axisLabelColor || 'gray'
    context.strokeStyle = 'gray'
    context.font = `${fontSize}px sans-serif`
    for (let i = 0; i <= xLabelNum; i++) {
        context.beginPath()
        context.moveTo(i * xAxisOffset + chartArea.left, chartArea.bottom + 1)
        context.lineTo(i * xAxisOffset + chartArea.left, chartArea.bottom + 4)
        context.stroke()
        context.fillText(xLabelFormat ? xLabelFormat(i) : (i * scale), i * xAxisOffset + chartArea.left, chartArea.bottom + textPadding + 4)
    }
    
    // draw load span
    let series = []
    for (let [index, item] of Object.entries(loadChartData)) {
        context.fillStyle = colors[index % colors.length]
        series.push({
            label: item.label,
            color: colors[index % colors.length]
        })
        for (let span of item.data) {
            span = toPercentage([span[0] - ox, span[1] - ox], [maxSpan, maxSpan])
            if (mergeChart) {
                fillRectP(context, span[0], 1 - barHeight, span[1] - span[0], barHeight, chartArea)
            } else {
                fillRectP(context, span[0], 1 - index * offset - offset, span[1] - span[0], offset, chartArea)
            }
        }
    }

    let emptyHint = opts.emptyHint || config.emptyHint
    if (empty && emptyHint) {
        context.textBaseline = 'middle'
        context.textAlign = 'center'
        context.fillStyle = opts.axisLabelColor || config.axisLabelColor || 'gray'
        context.font = `${fontSize}px sans-serif`
        context.fillText(emptyHint, width >> 1, height >> 1)
    }

    // 绘制图示
    if (chart.opts.legend !== false) {
        let legendRegion = getRelativeRegion(width, height, padding, {top: height - bottomAreaHeight + 20})
        drawLegend(context, series, legendRegion, {markWidth: 10, legendFontsize: 14, legendLabelColor: opts.legendLabelColor}, config)
    }
    
}

export default drawLoadChart