function getDrawableArea(width, height, padding=0, offset={}) {
    let top = padding + (offset.top || 0)
    let left = padding + (offset.left || 0)
    width = width - left - padding - (offset.right || 0)
    height = height - top - padding - (offset.bottom || 0)
    return {
        top,
        left,
        width,
        height,
        right: left + width,
        bottom: height + top
    }
}

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
    let { context, width, height } = chart
    let padding = config.padding || 0
    let textPadding = config.textPadding || 0
    let loadChartData = chart.chartData.data || []
    let bottomAreaHeight = 30
    let leftArea = 40
    let chartArea = getDrawableArea(width, height, padding, {bottom: bottomAreaHeight, left: leftArea})
    console.log(chartArea)
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
        context.textAlign = 'right'
        context.fillStyle = '#7e7e7e'
        context.font = `15px Microsoft YaHei`
        context.textBaseline = 'middle'
        context.fillText(loadChartData[i].label, leftArea - textPadding, chartArea.bottom - i * offset * chartArea.height - chartArea.height * offset * 0.5)
    }
    let xAxisOffset = parseInt(chartArea.width / (maxSpan > 10 ? 10 : maxSpan))
    console.log(xAxisOffset)
    for (let i = 0; i * xAxisOffset < chartArea.width; i++) {
        context.textBaseline = 'top'
        context.fillText(i, i * xAxisOffset + chartArea.left + textPadding, chartArea.bottom + textPadding)
    }
    
    // draw load span
    let labels = []
    for (let [index, item] of Object.entries(loadChartData)) {
        context.fillStyle = config.colors[index] || '#ff0000'
        labels.push([item.label, config.colors[index] || '#ff0000'])
        for (let span of item.data) {
            span = toPercentage(span, [maxSpan, maxSpan])
            fillRectP(context, span[0], 1 - index * offset - offset, span[1] - span[0], offset, chartArea)
        }
    }

    // 绘制图示
    for (let label of labels) {
        // console.log(label)
    }

    // context.fillStyle = config.colors[0]
    // context.fillRect(0, 0, width, height)
    // context.fillStyle = config.colors[1]
    // context.fillRect(chartArea.left, chartArea.top, chartArea.width, chartArea.height)
}

export default drawLoadChart