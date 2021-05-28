<template>
  <div id="mobility"></div>
</template>

<script>
import Mobility from "../../../static/Mobility.json"
export default {
    mounted(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('mobility'));
        var TownName_from_json = [];
        var TargetName_from_json = [];
        Mobility.Mobility.forEach(element => {
            TownName_from_json.push(element['TownName']);
            TargetName_from_json.push(element['TargetName']);

        });
        // 数组去重
        let days = [...new Set(TownName_from_json)];
        days.sort()
        let hours = [...new Set(TargetName_from_json)];
        hours.sort()

        var data_set_from_json = [];

        var agency = [];
        Mobility.Mobility.forEach(element => {
            agency = [];
            days.findIndex(function(days_value, days_index) {
                    if (days_value === element['TownName']) {
                        //则包含该元素
                        // console.log('成功找到' + value + index)
                        hours.findIndex(function(hours_value, hours_index) {
                            if (hours_value === element['TargetName']) {
                                //则包含该元素
                                agency.push(hours_index);
                                agency.push(days_index)
                                agency.push(element['Probability'])
                                    // console.log('成功找到' + value + index)

                            }
                        })
                    }
                })
            data_set_from_json.push(agency)
        });

        let option = {
            title: {
                top: '0%',
                left: 'center',
                text: 'Probability of Population Mobility',
                // bottom: '5%'
            },


            tooltip: {
                position: 'top'
            },


            grid: {
                left: '9%',
                top: '17%',
                right: '0%',
                bottom: '0%',
                // containLabel: true

            },

            xAxis: {
                position: 'top',
                type: 'category',
                data: hours,
                splitArea: {
                    show: true
                },
                axisLabel: {
                    // 坐标轴刻度标签的相关设置。
                    show: true,
                    interval: 0,
                    formatter: function(value) { //关键代码
                        var res = value
                        if (res.length > 7) {
                            res = res.substring(0, 6) + '..'
                        }
                        return res
                    },
                },

            },
            yAxis: {
                type: 'category',
                data: days,
                splitArea: {
                    show: true
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        // color: '#fff',
                        fontSize: '9'
                    }
                },
                inverse: true

                // boundaryGap: [0.5, 0.5]
            },
            visualMap: {
                min: 0,
                // max: 10,
                max: 0.2,
                type: 'continuous',
                // 是否显示拖拽用的手柄（手柄能拖拽调整选中范围）。
                calculable: true,
                show: false,
                orient: 'horizontal',
                left: 'center',
                bottom: '15%',
                // inRange: { color: ['red', 'blue'] },
                inRange: { color: ['#A3E4D7', '#1A5276'] },
            },

            series: [{
                name: 'Probility',
                type: 'heatmap',
                // data: data,
                data: data_set_from_json,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        // 把配置项给实例对象，跟着浏览器同比例缩放
        window.addEventListener('resize', function() {
            myChart.resize();
        })

    }
}
</script>

<style>

</style>