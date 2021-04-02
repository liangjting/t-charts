import { drawAxis, calcAxisSeries } from './drawAxis'
import { getRelativeRegion } from './utils'
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
    context.save()
    context.fillStyle = pointColor
    context.beginPath()
    context.arc(...toptip.point, pointRadius, 0, 2 * Math.PI)
    context.fill()

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

    console.log('lefttop', leftTop, labelWidth, labelHeight)
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
export default function drawLineChart(context, series, opts, config) {
    let width = opts.width || 300
    let height = opts.height || 150
    let region = getRelativeRegion(width, height)
    let axis = calcAxisSeries(series, opts, config)
    let result = drawAxis(context, axis, region, opts, config)
    let cRegion = result.region
    let showMaxval = opts.showMaxval || false
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
    if (showMaxval && maxValPoint) {
        console.log(maxValPoint, maxVal)
        maxValPoint = [...coordFromPencentage(maxValPoint, cRegion)]
        drawToptips(context, {point: maxValPoint, label: maxVal}, cRegion, opts)
    }
    
}