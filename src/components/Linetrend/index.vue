<template>
    <div id="Linetrend" style="height: 330px;width: 500;"></div>
</template>

<script>
import Cases_Number_Monthly from "../../../static/Cases_Number_Monthly.json"
import {mapState} from 'vuex'
export default {
    computed:{
        ...mapState(['date_set_from_json','TownName_set_from_json','colorList','data_set_from_json','area_chosen_state','geojson_info','hoveredStateId','hl_line_mark'])
    },
    data(){
        return{

        }
    },

    mounted(){
    

    // 基于准备好的dom，初始化echarts实例
    // window.linetrend_myChart = this.$echarts.init(document.getElementById('Linetrend'));
    window.linetrend_myChart = this.$echarts.init(document.getElementById('Linetrend'));
        var base = +new Date(2006, 12, 30);
        var oneMonth = 30 * 24 * 3600 * 1000;
        var date = [];

        var date_set_from_json = [];
        var TownName_set_from_json = [];



        var data = [Math.random() * 300];
        var data1 = [Math.random() * 300];
        var data2 = [Math.random() * 300];
        var data3 = [Math.random() * 300];
        var data4 = [Math.random() * 300];

        // var data = [50, 100, 200, 60, 10, 200, 80, 100, 30, 200, 50, 100];
        // var data1 = [10, 200, 80, 100, 30, 200, 60, 10, 200, 80, 60, 10];

        // console.log(Math.random() * 300)
        var a;
        var predict_label;
        var predict_label_mark = 0;


    Cases_Number_Monthly.casenumbermonthly.forEach(element => {
            TownName_set_from_json.push(element['TownName']);
            a = element['Month'].split("/");
            a = a[2] + '/' + a[0] + '/' + a[1];
            date_set_from_json.push(a);
            if (predict_label_mark === 0) {
                if (element['Attributes'] === 'Predicted') {
                    predict_label = a;
                    predict_label_mark = 1
                }
            }
        });
        // 数组去重
        date_set_from_json = [...new Set(date_set_from_json)];
        // console.log(date_set_from_json)
        TownName_set_from_json = [...new Set(TownName_set_from_json)];

        var data_set_from_json = new Array(TownName_set_from_json.length);
        for (var i = 0; i < data_set_from_json.length; i++) {
            data_set_from_json[i] = new Array(date_set_from_json.length);
        }

        Cases_Number_Monthly.casenumbermonthly.forEach(element => {
            TownName_set_from_json.findIndex(function(TownName_value, TownName_index) {
                if (TownName_value === element['TownName']) {
                    //则包含该元素
                    a = element['Month'].split("/");
                    a = a[2] + '/' + a[0] + '/' + a[1];
                    date_set_from_json.findIndex(function(date_value, date_index) {
                        if (date_value === a) {
                            //则包含该元素
                            data_set_from_json[TownName_index][date_index] = element['The number of cases']
                                // agency.push(date_index)
                        }

                    })


                }
            })
        });
        // console.log(data_set_from_json)

        // console.log(agency)
        // console.log(data_set_from_json)
        var series_all_sum = [];
        // var colorList = ['#FF4933', '#3498DB', '#F4D03F ', '#6C3483 ', '#FF8C33', '#2ECC71', '#2980B9', '#33B7FF', '#334EFF', '#CB33FF', '#943126', '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622'];
        // window.colorList = ['rgba(255,73,51, 1)', 'rgba(52,152,219, 1)', 'rgba(244,208,63, 1)', 'rgba(108,52,131, 1)', 'rgba(255,140,51, 1)', 'rgba(46,204,113, 1)', 'rgba(41,128,185, 1)', 'rgba(51,183,255, 1)', 'rgba(51,78,255, 1)', 'rgba(203,51,255, 1)', 'rgba(148,49,38, 1)', 'rgba(194,53,49, 1)', 'rgba(47,69,84, 1)', 'rgba(97,160,168, 1)', 'rgba(212,130,101, 1)', 'rgba(145,199,174, 1)', 'rgba(116,159,131, 1)', 'rgba(202,134,34, 1)'];
        // console.log(colorList.length)
        // console.log("3",this.hl_line_mark);
        window.hl_line_mark = -1;

        series_all_sum.push({
            name: 'predict line',
            type: 'line',

            // 采用 Largest-Triangle-Three-Bucket 算法，可以最大程度保证采样后线条的趋势，形状和极值。
            sampling: 'lttb',
            // 线的颜色
            itemStyle: {
                color: 'rgb(255, 70, 131)'
            },
            markLine: {
                lineStyle: {
                    type: 'dashed'
                },
                data: [{
                    name: 'Predict dividing line',
                    // xAxis: '2015/4',
                    // xAxis: '2015/4/1',
                    xAxis: predict_label,
                    tooltip: {
                        formatter: '{b}: {c}'
                    }
                }, ],
                label: {
                    formatter: 'predict'
                },

            }
        })

        for (var i = 0; i < TownName_set_from_json.length; i++) {
            var series_clause = {};
            series_clause.name = TownName_set_from_json[i];
            series_clause.type = 'line';
            series_clause.symbol = 'diamond';
            series_clause.sampling = 'lttb';
            series_clause.itemStyle = {
                // color: 'rgb(255, 70, 131)'
                // color: '#1A5276'
                color: this.colorList[i]
            };
            series_clause.emphasis = {
                focus: 'series',
                blurScope: 'coordinateSystem'
            };
            series_clause.data = data_set_from_json[i];
            series_all_sum.push(series_clause);
            // console.log(series_all_sum[i])
            // console.log(series_all_sum)

        }

        for (var i = 1; i < 156; i++) {
            // var now = new Date(base += oneDay);
            var now = new Date(base += oneMonth);
            // var now = new Date(base += oneYear);
            // date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
            date.push([now.getFullYear(), now.getMonth()].join('/'));
            // round() 方法可把一个数字舍入为最接近的整数; 对于0.5，该方法将进行上舍入。
            data.push(Math.round((Math.random() - 0.5) * 10 + data[i - 1]));
            data1.push(Math.round((Math.random() - 0.4) * 50 + data1[i - 1]));
            data2.push(Math.round((Math.random() - 0.3) * 100 + data1[i - 1]));
            data3.push(Math.round((Math.random() - 0.2) * 150 + data1[i - 1]));
            data4.push(Math.round((Math.random() - 0.1) * 200 + data1[i - 1]));
            // data.push(Math.round(data[i - 1]));
            // data1.push(Math.round(data1[i - 1]));
        }

        window.linetrend_option = {
            // tooltip: {
            //     trigger: 'axis',
            //     position: function(pt) {
            //         return [pt[0], '10%'];
            //     }
            // },
            tooltip: {},
            legend: {
                y: 'top',
                x: 'center',
                // 'scroll'：可滚动翻页的图例。当图例数量较多时可以使用。
                type: 'scroll',
                // 在legend里加上top属性，可直接写数字top：5，代表具体的5像素；也可以写top: ‘5%’，具体参考echarts官方文档配置手册里 legend。
                top: '9%',
                left: '30%',
                // data: ['Growth', 'Budget 2011', 'Budget 2012'],
                // itemGap: 5
            },

            title: {
                left: 'center',
                text: 'Number of case Monthly',
            },
            // toolbox: {
            //     feature: {
            //         dataZoom: {
            //             yAxisIndex: 'none'
            //         },
            //         restore: {},
            //         saveAsImage: {}
            //     }
            // },
            xAxis: {
                type: 'category',
                name: 'Month',
                boundaryGap: false,
                // data: date,
                data: date_set_from_json,
                axisLabel: {
                    formatter: function(value) {
                        a = value.split("/");
                        return a[0] + '/' + a[1]
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: 'The number of case',
                // boundaryGap: [0, '100%']
                // 设置最大罪行值
                min: function(value) {
                    return value.min;
                },
                max: function(value) {
                    return value.max + 10;
                }
            },
            // dataZoom: [{
            //     type: 'inside',
            //     // 拉条一开始显示的范围
            //     start: 0,
            //     // end: 10
            //     end: 100
            // }, {
            //     start: 0,
            //     end: 10
            // }],

            dataZoom: [{
                    type: 'slider',
                    yAxisIndex: 0,
                    zoomLock: true,
                    width: 10,
                    right: 10,
                    top: 70,
                    bottom: 20,
                    start: 0,
                    end: 100,
                    handleSize: 0,
                    showDetail: false,
                }, {
                    type: 'inside',
                    id: 'insideY',
                    yAxisIndex: 0,
                    start: 95,
                    end: 100,
                    zoomOnMouseWheel: true,
                    moveOnMouseMove: true,
                    moveOnMouseWheel: true
                }, {
                    type: 'slider',
                    xAxisIndex: 0,
                    filterMode: 'weakFilter',
                    // height: 20,
                    // bottom: 0,
                    start: 0,
                    end: 100,
                    // handleIcon: 'path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    // handleSize: '80%',
                    showDetail: true
                }, {
                    type: 'inside',
                    id: 'insideX',
                    xAxisIndex: 0,
                    filterMode: 'weakFilter',
                    start: 0,
                    end: 26,
                    zoomOnMouseWheel: true,
                    moveOnMouseMove: true
                }

            ],

            series: series_all_sum


        };

        window.linetrend_myChart.on('datazoom', function(param){
            console.log('拖动');
            
        })

        // 使用刚指定的配置项和数据显示图表。
        window.linetrend_myChart.setOption(window.linetrend_option);



        // 把配置项给实例对象，跟着浏览器同比例缩放
        window.addEventListener('resize', function() {
            window.linetrend_myChart.resize();
        })


  }
}
</script>

<style>

</style>