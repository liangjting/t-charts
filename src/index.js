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

/**
 * pie
 */
let pieChart = new Charts({
    canvasId: 'pie',
    type: 'pie',
    chartData: {

    }
})

pieChart.feed({
    data: [
        {
            label: 'pie1',
            data: 23,
        },
        {
            label: 'pie2',
            data: 45
        },
        {
            label: 'pie1',
            data: 23,
        },
        {
            label: 'pie2',
            data: 4
        },
        {
            label: 'pie2',
            data: 4
        }
    ]
})

// line
let lineChart = new Charts({
    canvasId: 'line',
    type: 'line',
})

lineChart.feed({
    data: [
        [0, 0],
        [1, 1],
        [3, 9],
        [4, 16],
        [5, 25],
        [6, 36],
        [7, 49]
    ]
})