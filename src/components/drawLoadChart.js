import { measureText, getRelativeRegion, absoluteCoord } from '@/components/utils'
import drawLegend from './drawLegend'

function drawAxis() {

}

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
function drawLoadChart(chart, config) {
    let { width, height } = chart.opts
    let context = chart.context
    let padding = config.padding || 5
    let textPadding = config.textPadding || 0
    let loadChartData = chart.chartData.data || []
    let bottomAreaHeight = chart.opts.legend === false ? 16 : 40
    let leftArea = 40
    let chartArea = getRelativeRegion(width, height, padding, {bottom: bottomAreaHeight, left: 0})
    // console.log(chartArea)
    let xLabelFormat = chart.opts.xLabelFormat
    context.clearRect(0, 0, width, height)
    
    context.lineWidth = 1
    context.strokeStyle = '#eeeeee'
    let offset = 1 / loadChartData.length
    let maxSpan = 0
    // draw axis
    for (let i = 0; i < loadChartData.length; i++) {
        if (i == 0) {
            context.strokeStyle = 'gray'
        } else {
            context.strokeStyle = '#eeeeee'
        }
        context.beginPath()
        context.moveTo(chartArea.left, chartArea.bottom - i * offset * chartArea.height + 1)
        context.lineTo(chartArea.right, chartArea.bottom - i * offset * chartArea.height + 1)
        context.stroke()
        let list = loadChartData[i].data
        if (list.length > 0) {
            maxSpan = Math.max(list[list.length - 1][1], maxSpan)
        }
    }
    let scale = 1
    while (maxSpan / scale > 14) {
        scale++
    }
    let xAxisOffset = parseInt(chartArea.width / (maxSpan / scale))
    // console.log(xAxisOffset)
    context.textBaseline = 'top'
    context.textAlign = 'center'
    context.strokeStyle = 'gray'
    context.fillStyle = 'gray'
    for (let i = 0; i * xAxisOffset < chartArea.width; i++) {
        context.beginPath()
        context.moveTo(i * xAxisOffset + chartArea.left, chartArea.bottom + 1)
        context.lineTo(i * xAxisOffset + chartArea.left, chartArea.bottom + 4)
        context.stroke()
        context.fillText(xLabelFormat ? xLabelFormat(i * scale) : (i * scale), i * xAxisOffset + chartArea.left, chartArea.bottom + textPadding + 4)
    }
    
    // draw load span
    let series = []
    for (let [index, item] of Object.entries(loadChartData)) {
        context.fillStyle = config.colors[index % config.colors.length]
        series.push({
            label: item.label,
            color: config.colors[index % config.colors.length]
        })
        for (let span of item.data) {
            span = toPercentage(span, [maxSpan, maxSpan])
            fillRectP(context, span[0], 1 - index * offset - offset, span[1] - span[0], offset, chartArea)
        }
    }

    // 绘制图示
    if (chart.opts.legend !== false) {
        let legendRegion = getRelativeRegion(width, height, padding, {top: height - bottomAreaHeight + 20})
        drawLegend(context, series, legendRegion, {markWidth: 10, legendFontsize: 14}, config)
    }
    
}

export default drawLoadChart