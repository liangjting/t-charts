import { drawAxis, calcAxisSeries } from './drawAxis'
import { getRelativeRegion, onePixelLine } from './utils'
function coordFromPencentage([xp, yp], {left, bottom, width, height}) {
    return [xp * width + left, bottom - yp * height]
}

/**
 * 
 * @param {*} context 
 * @param {{point: [number, number], label: string}} toptip 
 * @param {*} region 
 * @param {*} opts 
 */
function drawToptips(context, toptip, region, opts={}) {
    let fontColor = 'white'
    let fontSize = 14
    let pointColor = opts.maxvalColor || '#ff5757'
    let pointRadius = 3
    let labelPadding = 2
    let padding = 6
    let lineStyle = opts.toptipsLineStyle || ''
    context.save()
    context.fillStyle = pointColor
    context.beginPath()
    context.arc(...toptip.point, pointRadius, 0, 2 * Math.PI)
    context.fill()

    context.strokeStyle = pointColor
    context.setLineDash([4, 2])
    context.lineWidth = 1
    if (/hl/.test(lineStyle)) {
        onePixelLine(context, region.left, toptip.point[1], region.right, toptip.point[1], opts.dpr)
    }
    if (/vl/.test(lineStyle)) {
        onePixelLine(context, toptip.point[0], region.top, toptip.point[0], region.bottom, opts.dpr)
    }
    

    let [x, y] = toptip.point
    let labelWidth = context.measureText(toptip.label).width + labelPadding * 2
    let labelHeight = fontSize + labelPadding * 2

    

    if (y - labelHeight / 2 - padding > region.top) {
        y -= labelHeight / 2 + padding
    } else {
        y += labelHeight / 2 + padding
    }
    if (x - labelWidth / 2 < region.left) {
        x = region.left + labelWidth / 2
    } else if (x + labelWidth / 2 > region.right) {
        x = region.right - labelWidth / 2
    }


    let leftTop = [x - labelWidth / 2, y - labelHeight / 2]

    // console.log('lefttop', leftTop, labelWidth, labelHeight)
    context.fillRect(...leftTop, labelWidth, labelHeight)

    context.fillStyle = fontColor
    context.font = `${fontSize}px sans-serif`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(toptip.label, x, y)
    context.restore()
}
/**
 * 
 * @param {*} context 
 * @param {*} series 
 * @param {{color}} opts 
 * @param {*} config 
 */
export default function drawLineChart(context, chartData, opts, config) {
    let width = opts.width || 300
    let height = opts.height || 150
    let region = getRelativeRegion(width, height)
    const series = chartData.data || []
    const marks = chartData.marks || []
    let axis = calcAxisSeries(series, opts, config)
    let result = drawAxis(context, axis, region, opts, config)
    let cRegion = result.region
    let showMaxval = opts.showMaxval || false
    const fillGradient = opts.fillGradient || false
    // console.log(axis, result)
    // context.fillStyle = 'red'
    // context.fillRect(cRegion.left, cRegion.top, cRegion.width, cRegion.height)
    context.strokeStyle = opts.color || 'red'
    let xRange = axis.xRange || 10
    let yMax = axis.yMax || 10
    let xOrigin = result.xOrigin || 0
    let maxVal, maxValPoint
    let points = series.map(([x, y]) => {
        let p = [(x - xOrigin) / xRange, y/ yMax]
        if (maxVal === undefined) {
            maxVal = y
            maxValPoint = p
        } else if (y > maxVal) {
            maxVal = y
            maxValPoint = p
        }
        return p
    })
    // console.log(points)
    if (points.length > 0) {
        context.beginPath()
        context.moveTo(...coordFromPencentage(points[0], cRegion))
        for (let p of points) {
            context.lineTo(...coordFromPencentage(p, cRegion))
        }
        context.stroke()
    }
    if (fillGradient && points.length > 0) {
        context.lineTo(...coordFromPencentage([points[points.length - 1][0], 0], cRegion))
        context.lineTo(...coordFromPencentage([points[0][0], 0], cRegion))
        context.lineTo(...coordFromPencentage(points[0], cRegion))
        context.closePath()
        
        let gradient = context.createLinearGradient(0, 0, 0, cRegion.height);
        gradient.addColorStop(0, opts.color || 'red');
        gradient.addColorStop(1,'rgba(255, 255, 255, 0)');
        context.fillStyle = gradient//opts.color || 'red'
        context.fill()
    }
    if (showMaxval && maxValPoint) {
        // console.log(maxValPoint, maxVal)
        maxValPoint = [...coordFromPencentage(maxValPoint, cRegion)]
        drawToptips(context, {point: maxValPoint, label: maxVal}, cRegion, opts)
    }

    if (marks.length > 0) {
        console.log(result)
        const {xOrigin, xRange, yMin, yRange} = result
        const {left, top, width, height} = cRegion
        const m = marks.map(([x, y]) => {
            x -= xOrigin
            y -= yMin
            x = width * x / xRange + left
            y = height - height * y / yRange + top
            return [x, y]
        })
        drawMarks(context, m, opts)
    }
}

function drawMarks(context, marks, opts) {
    context.fillStyle = opts.color || 'red'
    const margin = 4
    for (let [x, y] of marks) {
        if (isNaN(x) || isNaN(y)) continue
        context.beginPath()
        context.moveTo(x, y - margin)
        context.lineTo(x + 7, y - 9 - margin)
        context.lineTo(x - 7, y - 9 - margin)
        context.closePath()
        context.fill()
    }
}