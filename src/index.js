import Charts from '@/app.js'
var progress = 20
let charts = new Charts({
    canvasId: 'ring-progress',
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
    charts.feed({
        progress
    })
}

/**
 * 负荷图
 */
let loadChart = new Charts({
    canvasId: 'load-chart',
    type: 'load-chart',
    chartData: {

    }
})

loadChart.feed({
    data: [
        {
            label: '深睡',
            data: [[0, 1], [2, 3], [8, 9.5]]
        },
        {
            label: '浅睡',
            data: [[1, 2], [4, 6], [9.5, 10]]
        },
        {
            label: '清醒',
            data: [[3, 4], [6, 8]]
        }
    ]
})