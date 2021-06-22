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
    xLabelFormat: (val) => {
        // console.log(val)
        return val + 'hr'
    },
    // mergeChart: true,
    // barHeight: 0.8,
    // colors: ['red', 'orange', 'yellow'],
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
    labelMargin: 2, // label 之间最小间隔距离
    // labelLine: 'straight',
    chartData: {

    }
})

pieChart.feed({
    data: [
        {
            label: '中文pie',
            data: 4,
        },
        {
            label: '中文pie2',
            data: 42
        },
        {
            label: 'pie1',
            data: 12,
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
            data: 44,
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
            data: 4,
        },
        {
            label: 'pie2',
            data: 4
        },
        {
            label: 'pie1',
            data: 4,
        },
        {
            label: 'pie2',
            data: 4
        },
        // {
        //     label: 'pie1',
        //     data: 5,
        // },
        // {
        //     label: 'pie2',
        //     data: 42
        // },
        // {
        //     label: 'pie2',
        //     data: 4
        // },
        // {
        //     label: 'pie1',
        //     data: 23,
        // },
        // {
        //     label: 'pie2',
        //     data: 4
        // },

    ]
})

// line
let lineChart = new Charts({
    canvasId: 'line',
    type: 'line',
    xLabelNum: 0,//5,
    yLabelNum: 1,
    axisFontSize: 14,
    showMaxval: true,

    // axisColor: '#FFFFFFFF',
    toptipsLineStyle: 'vlhl',
    maxvalColor: 'black',
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
    xLabelMinWidth: 200,
    yValType: 'integer'
})

barChart.feed({
    data: [
        {
            label: '周一',
            data: 17
        },
        {
            label: '周二',
            data: 1
        },
        {
            label: '周二',
            data: 3
        },
        {
            label: '周四',
            data: 1
        }
    ]
})

//bar
const arrBar = new Charts({
    canvasId: 'bar-2',
    type: 'bar',
    xLabels: [],
    // xLabelMinWidth: 200,
    xLabelAlign: 'center',
    barMargin: 2,
    barWidth: 10,
    xLabelNum: 6,
    yValType: 'integer',
    xLabelFormat(label) {
        return label.replace(/\..*/, '') + 's'
    },
    yLabelFormat(label) {
        return label
    },
})

arrBar.feed({
    data: [
        [1, 3],
        [2, 3],
        [3, 3],
        [4, 3],
        [5, 3],
        [6, 3],
        [7, 3],
        [8, 3],
        [9, 3],
        [10, 3],
        [11, 3],
        [12, 3],
        [13, 3],
        [14, 3],
        [15, 3],
        [16, 3],
        [17, 3],
        [18, 5],
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

const kAvgChart = new Charts({
    canvasId: 'k-avg',
    type: 'k-avg',
    xLabelMinWidth: 30,
    barWidth: 10,
    color: 'red',
    lineColor: '#aeaeae'
    // lineColor: 'gray'
})

let scrollStart = false
let clientXStart = 0
document.querySelector('#k-avg').addEventListener('mousedown', function(ev) {
    // console.log('mousedown', ev)
    clientXStart = ev.clientX
    scrollStart = true
})
document.querySelector('#k-avg').addEventListener('mouseup', function(ev) {
    scrollStart = false
    // console.log('mouseup', ev)
    // kAvgChart.endScroll()
})
document.querySelector('#k-avg').addEventListener('mouseout', function(ev) {
    scrollStart = false
    // console.log('mouseup', ev)
    // kAvgChart.endScroll()
})
document.querySelector('#k-avg').addEventListener('mousemove', function(ev) {
    // console.log('mouse move', ev)
    if (scrollStart) {
        let scrollX = ev.clientX - clientXStart
        // console.log('scrollX', scrollX)
        kAvgChart.scrollBy(scrollX)
        clientXStart = ev.clientX
    }
})

document.querySelector('#bar').addEventListener('mousedown', function(ev) {
    // console.log('mousedown', ev)
    clientXStart = ev.clientX
    scrollStart = true
})
document.querySelector('#bar').addEventListener('mouseup', function(ev) {
    scrollStart = false
    // console.log('mouseup', ev)
    // kAvgChart.endScroll()
})
document.querySelector('#bar').addEventListener('mouseout', function(ev) {
    scrollStart = false
    // console.log('mouseup', ev)
    // kAvgChart.endScroll()
})
document.querySelector('#bar').addEventListener('mousemove', function(ev) {
    // console.log('mouse move', ev)
    if (scrollStart) {
        let scrollX = ev.clientX - clientXStart
        // console.log('scrollX', scrollX)
        barChart.scrollBy(scrollX)
        clientXStart = ev.clientX
    }
})

document.querySelector('#separate-stack-bar').addEventListener('mousedown', function(ev) {
    clientXStart = ev.clientX
    scrollStart = true
})
document.querySelector('#separate-stack-bar').addEventListener('mouseup', function(ev) {
    scrollStart = false
})
document.querySelector('#separate-stack-bar').addEventListener('mouseout', function(ev) {
    scrollStart = false
})
document.querySelector('#separate-stack-bar').addEventListener('mousemove', function(ev) {
    if (scrollStart) {
        let scrollX = ev.clientX - clientXStart
        separateStackBar.scrollBy(scrollX)
        clientXStart = ev.clientX
    }
})

kAvgChart.feed([
    {
        label: '周一',
        data: [2, 4, 3]
    },
    {
        label: '周二',
        data: [3, 5, 3.4]
    },
    {
        label: '周二',
        data: [1, 7, 2]
    },
    {
        label: '周四',
        data: [4, 8, 7]
    },
    {
        label: '周一',
        data: [2, 4, 3]
    },
    {
        label: '周二',
        data: [3, 5, 3.4]
    },
    {
        label: '周二',
        data: [1, 7, 2]
    },
    {
        label: '周四',
        data: [4, 8, 7]
    },
    {
        label: '周一',
        data: [2, 4, 3]
    },
    {
        label: '周二',
        data: [3, 5, 3.4]
    },
    {
        label: '周二',
        data: [1, 7, 2]
    },
    {
        label: '周四',
        data: [4, 8, 7]
    },
    {
        label: '周一',
        data: [2, 4, 3]
    },
    {
        label: '周二',
        data: [3, 5, 3.4]
    },
    {
        label: '周二',
        data: [1, 7, 2]
    },
    {
        label: '周四',
        data: [4, 8, 7]
    },
    {
        label: '周一',
        data: [2, 4, 3]
    },
    {
        label: '周二',
        data: [3, 5, 3.4]
    },
    {
        label: '周二',
        data: [1, 7, 2]
    },
    {
        label: '周四',
        data: [4, 8, 7]
    },
    {
        label: '周一',
        data: [2, 4, 3]
    },
    {
        label: '周二',
        data: [3, 5, 3.4]
    },
    {
        label: '周二',
        data: [1, 7, 2]
    },
    {
        label: '周四',
        data: [4, 8, 7]
    },
    {
        label: '周一',
        data: [2, 4, 3]
    },
    {
        label: '周二',
        data: [3, 5, 3.4]
    },
    {
        label: '周二',
        data: [1, 7, 2]
    },
    {
        label: '周四',
        data: [4, 8, 7]
    }
])

const separateStackBar = new Charts({
    canvasId: 'separate-stack-bar',
    type: 'stack-bar',
    legends: ['清醒', '深睡', '浅睡'],
    colors: ['#ff4975', '#01c412', '#bebebe'],
    separateBar: true,
    barMargin: 2,
    yLabelFormat: (label) => {
        return label + 'h'
    }
})

separateStackBar.feed({
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
        },
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