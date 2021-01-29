import drawPieChart from './drawPieChart'
export default function drawRingChart(context, series, opts, config) {
    let result = drawPieChart(context, series, opts, config)
    let ringWidth = opts.ringWidth || 24
    context.fillStyle = '#ffffff'
    let raduis = result.pieRadius - ringWidth
    raduis = raduis < 0 ? 0 : raduis
    context.beginPath()
    context.arc(...result.center, raduis, 0, 2 * Math.PI)
    context.fill()
}