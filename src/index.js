import Charts from '@/app.js'
var progress = 20
let charts = new Charts({
    canvasId: 'ring-progress',
    type: 'ring-progress',
    chartData: {
        progress,
    },
    label: '睡眠得分',
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
    labelFormat: (label, val, sum) => {
        return (val * 100 / sum).toFixed(1) + '% ' + label
    },
    labelSize: 12,
    // labelLine: 'straight',
    chartData: {

    }
})

pieChart.feed({
    data: [
        {
            label: 'pie1',
            data: 2,
        },
        {
            label: 'pie2',
            data: 43
        },
        {
            label: 'pie1',
            data: 5,
        },
        {
            label: 'pie2',
            data: 4
        },
        {
            label: 'pie2',
            data: 4
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
            label: 'pie1',
            data: 322,
        },
        {
            label: 'pie2',
            data: 4
        },

    ]
})

let ringChart = new Charts({
    canvasId: 'ring',
    type: 'ring',
    labelSize: 14,
})
ringChart.feed({
    data: [
        {
            label: 'pie1',
            data: 2,
        },
        {
            label: 'pie2',
            data: 4
        },
        {
            label: 'pie1',
            data: 5,
        },
        {
            label: 'pie2',
            data: 42
        },
        {
            label: 'pie2',
            data: 4
        },
        {
            label: 'pie1',
            data: 23,
        },
        {
            label: 'pie2',
            data: 4
        },

    ]
})

// line
let lineChart = new Charts({
    canvasId: 'line',
    type: 'line',
    xLabelNum: 5,
    axisFontSize: 14,
    xLabelFormat(label) {
        return label + 'm'
    },
    yLabelFormat(label) {
        return label + 'm²'
    },
    xLabelAlign: 'start',
    yMin: 0
})

lineChart.feed({
    data: [
        [-7, 49],
        [-6, 36],
        [-5, 25],
        [-4, 16],
        [-3, 9],
        [-2, 4],
        [-1, 1],
        [0, 0],
        [1, 1],
        [2, 4],
        [3, 9],
        [4, 16],
        [5, 25],
        [6, 36],
        [7, 49]
    ]
})

document.getElementById('line-btn').addEventListener('click', line)
function line() {
    console.log('line btn click')
    lineChart.feed({
        data: [
            [-7, 49],
            [-6, 36],
            [-5, 25],
            [-4, 16],
            [-3, 9],
            [-2, 4],
            [-1, 1],
            [0, 0],
            [1, 1],
            [2, 4],
            [3, 9],
            [4, 16],
            [5, 25],
            [6, 36],
            [7, 49]
        ]
    })
}


//bar
const barChart = new Charts({
    canvasId: 'bar',
    type: 'bar',
    xLabels: [],
})

barChart.feed({
    data: [
        {
            label: '周一',
            data: 4
        },
        {
            label: '周二',
            data: 7
        },
        {
            label: '周二',
            data: 8
        },
        {
            label: '周四',
            data: 12
        }
    ]
})


// stack-bar
const stackBar = new Charts({
    canvasId: 'stack-bar',
    type: 'stack-bar',
    legends: ['清醒', '深睡', '浅睡'],
    yLabelFormat: (label) => {
        return label + 'h'
    }
})

stackBar.feed({
    data: [
        {
            label: '周一',
            data: [4, 2, 1]
        },
        {
            label: '周二',
            data: [3, 5, 2]
        },
        {
            label: '周二',
            data: [1, 7, 4]
        },
        {
            label: '周四',
            data: [8, 4, 1]
        }
    ]
})

