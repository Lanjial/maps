<template>
  <div id="weight" style="height: 330px;width: 200;"></div>
</template>

<script>
import Socio_Economic from "../../../static/Socio_Economic.json"
export default {
    data(){
        return{
            
        }
    },
    mounted(){
         let myChart = this.$echarts.init(document.getElementById('weight'));

        // 指定图表的配置项和数据
        var xAxisData = [];
        var data1 = [];
        var data2 = [];
        var data3 = [];
        var data4 = [];
        var data_set_from_json = [];
        // console.log(Socio_Economic_Relativity.soecorela[0]['Relativity Value'])
        Socio_Economic.soecorela.forEach(element => {
            data_set_from_json.push(element['Relativity Value']);
            xAxisData.push(element['Socio-Economic indicators name']);
        });
        var emphasisStyle = {
            itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.3)'
            }
        };

        let option = {
            title: {
                left: 'center',
                text: 'Weight of 20-socio-Economic Indicators',
            },
            tooltip: {},
            xAxis: {
                data: xAxisData,
                name: 'X Axis',
                show: false,
                axisLine: { onZero: true },
                splitLine: { show: false },
                splitArea: { show: false },
                // 柱状图的x轴文字纵向显示
                axisLabel: {
                    formatter: function(value) {
                        return value.split("").join("\n");
                    }
                }
            },
            yAxis: {
                name: 'Relatively Value',
            },
            // grid: {
            //     bottom: 100
            // },
            grid: {
                left: '8%',
                top: '20%',
                right: '0%',
                bottom: '4%',
                // containLabel: true

            },
            series: [{
                    name: 'bar',
                    type: 'bar',
                    stack: 'one',
                    emphasis: emphasisStyle,
                    // data: data1,
                    data: data_set_from_json,
                    barWidth: 20,
                    barMinHeight: 2,

                    // 为每个柱子给定颜色，不够的话开始循环
                    itemStyle: {
                        normal: {
                            //这里是重点
                            // 循环这样子方便点 
                            color: function(params) {
                                let colorList = ['#FF4933', '#3498DB', '#F4D03F ', '#6C3483 ', '#FF8C33', '#2ECC71', '#2980B9', '#33B7FF', '#334EFF', '#CB33FF', '#943126', '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622'];
                                return colorList[params.dataIndex % colorList.length];
                            }
                        }
                    }
                },
                {
                    name: 'bar2',
                    type: 'bar',
                    stack: 'one',
                    emphasis: emphasisStyle,
                    data: data2
                },
                {
                    name: 'bar3',
                    type: 'bar',
                    stack: 'two',
                    emphasis: emphasisStyle,
                    data: data3
                },
                {
                    name: 'bar4',
                    type: 'bar',
                    stack: 'two',
                    emphasis: emphasisStyle,
                    data: data4
                }
            ]
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