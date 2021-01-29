# 说明
基于canvas 的前端网页图表绘画工具类，适用于微信小程序和网页前端工程

代码未经整理比较乱，详细使用，参考sr/index.js 例子文件

可打开 dist/index.html 查看例程显示效果

可直接使用 dist/t-charts.js
## 目前支持的图表类型
* 饼状图
* 环形图
* 曲线图
* 柱状图
* 堆叠柱状图
* 载荷图
* 环形进度图
# 安装编译
clone 仓库下来后，进入根目录运行
```
npm install
```

## 运行调试
```
npm run dev
```

## 编译
```
npm run build
```

# 微信小程序或前端工程中使用
将打包生成（位于./dist/）的 t-charts.js 复制到小程序工程中的目录下（例如：utils文件夹

在需要的页面js文件中引入
``` javascript
const { Charts } = require('../../utils/t-charts.js')
```

调用
``` javascript
// 详情参考 src/index.js 文件中各种类型图表例子的使用
let lineChart = new Charts({
    canvasId: 'line', // canvas id
    type: 'line', // 图表类型
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

// 设置图表数据
lineChart.feed(
    [
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
)
```

# TODO
* bug fix
* 重构整理代码
* 动画效果
* measureText 方法修改
