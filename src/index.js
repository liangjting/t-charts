import Charts from '@/app.js'
var progress = 20
let charts = new Charts({
    canvasId: 'canvas',
    type: 'ring-progress',
    chartData: {
        progress,
    },
    extraText: '睡眠得分'
})
charts.draw()
document.getElementById('test-btn').addEventListener('click', update)
function update() {
    // console.log('update btn click')
    progress += 5
    charts.updateData({
        progress
    })
}