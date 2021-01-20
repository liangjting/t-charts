function drawRingProgress(chart, config) {
    let { progress } = chart.chartData
    let { width, height } = chart.opts
    let context = chart.context
    
    let padding = config.padding || 0
    let barWidth = config.ringProgressBarWidth || 10
    let radius = (Math.min(width, height) - 2 * padding - barWidth) >> 1
    let center = [parseInt(width / 2), parseInt(height / 2)]
    let extraText = chart.opts.extraText
    // console.log(width, height, radius, center)
    // console.log(radius)
    if (progress == undefined) progress = 0
    progress = progress > 100 ? 100 : progress
    context.clearRect(0, 0, width, height)
    context.lineWidth = barWidth
    context.strokeStyle = '#eeeeee'
    context.beginPath();
    context.arc(...center, radius, 0, 2 * Math.PI);
    context.stroke();
    context.strokeStyle = config.ringProgressColor || '#ee0000'
    context.beginPath();
    context.arc(...center, radius, 1.5 * Math.PI, (1.5 + progress / 50) * Math.PI);
    context.stroke();

    context.fillStyle = '#000000'
    context.font = `${radius * 0.8}px Microsoft YaHei`
    context.textAlign = 'center'
    context.fillText(progress, center[0], center[1] * 1.2)
    if (extraText) {
        context.fillStyle = '#7e7e7e'
        context.font = `${radius * 0.2}px Microsoft YaHei`
        context.fillText(extraText, center[0], center[1] * 1.5)
    }
}

export default drawRingProgress