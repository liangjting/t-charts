import { drawAxis, calcAxisSeries } from './drawAxis'
import { getRelativeRegion } from './utils'
function coordFromPencentage([xp, yp], {left, bottom, width, height}) {
    return [xp * width + left, bottom - yp * height]
}
export default function drawLineChart(context, series, opts, config) {
    let width = opts.width || 300
    let height = opts.height || 150
    let region = getRelativeRegion(width, height)
    let axis = calcAxisSeries(series, opts)
    let result = drawAxis(context, axis, region, opts, config)
    let cRegion = result.region
    console.log(axis, result)
    // context.fillStyle = 'red'
    // context.fillRect(cRegion.left, cRegion.top, cRegion.width, cRegion.height)
    context.strokeStyle = opts.color || 'red'
    let xMax = axis.xMax || 10
    let yMax = axis.yMax || 10
    let points = series.map(([x, y]) => [x / xMax, y/ yMax])
    console.log(points)
    if (points.length > 0) {
        context.beginPath()
        context.moveTo(...coordFromPencentage(points[0], cRegion))
        for (let p of points) {
            console.log(...coordFromPencentage(p, cRegion))
            context.lineTo(...coordFromPencentage(p, cRegion))
        }
        context.stroke()
    }
    
}