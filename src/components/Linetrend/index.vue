<template>
    <div id="Linetrend" style="height: 330px;width: 500;"></div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import {getMonthlyCases} from '@/api/index'
export default {
    computed:{
        ...mapGetters(['linetrendData','linetrend_option','linetrend_myChart']),
        ...mapState(['colorList','hoveredStateId','hl_line_mark'])
    },
    data(){
        return{
            predict_label:"",
            predict_label_mark:0,
            TownName_set_from_json :[],
            date_set_from_json:[],
            data_set_from_json:[],
            series_all_sum:[],
            base:[],
            oneMonth:[],
            date:[],
            data:[],
            data1:[],
            data2:[],
            data3:[],
            data4:[],
        }
    },
    mounted(){
        // 基于准备好的dom，初始化echarts实例
        // window.linetrend_myChart = this.$echarts.init(document.getElementById('Linetrend'));
        window.linetrend_myChart = this.$echarts.init(document.getElementById('Linetrend'));
        this.$store.commit('Linetrend/getLinetrend_myChart',window.linetrend_myChart)
        this.getNowTime()
        this.getMonthlyCases()
    },
    methods:{
        // 获取起始时间
        getNowTime(){
            this.base = +new Date(2006, 12, 30);
            this.oneMonth = 30 * 24 * 3600 * 1000;
            this.data = [Math.random() * 300];
            this.data1 = [Math.random() * 300];
            this.data2 = [Math.random() * 300];
            this.data3 = [Math.random() * 300];
            this.data4 = [Math.random() * 300];
        },
        // 发送请求，获取数据
        async getMonthlyCases(){
            let {data} = await getMonthlyCases()
            this.$store.commit('Linetrend/getLinetrendData',data)
            this.timeNameHandle()
        },
        // 名称与时间数据处理
        timeNameHandle(){
            let a;
            this.linetrendData.casenumbermonthly.forEach(element => {
                this.TownName_set_from_json.push(element['TownName']);
                a = element['Month'].split("/");
                a = a[2] + '/' + a[0] + '/' + a[1];
                this.date_set_from_json.push(a);
                if (this.predict_label_mark === 0) {
                    if (element['Attributes'] === 'Predicted') {
                        this.predict_label = a;
                        this.predict_label_mark = 1
                    }
                }
            });
            
            // 数组去重
            this.date_set_from_json = [...new Set(this.date_set_from_json)];
            this.TownName_set_from_json = [...new Set(this.TownName_set_from_json)];

            this.data_set_from_json = new Array(this.TownName_set_from_json.length);
            for (let i = 0; i < this.data_set_from_json.length; i++) {
                this.data_set_from_json[i] = new Array(this.date_set_from_json.length);
            }
            
            let Date = this.date_set_from_json
            let DataSet = this.data_set_from_json
            // console.log(DataSet);
            this.linetrendData.casenumbermonthly.forEach(element => {
                this.TownName_set_from_json.findIndex(function(TownName_value, TownName_index) {
                    if (TownName_value === element['TownName']) {
                        //则包含该元素
                        a = element['Month'].split("/");
                        a = a[2] + '/' + a[0] + '/' + a[1];
                        Date.findIndex(function(date_value, date_index) {
                            if (date_value === a) {
                                //则包含该元素
                                DataSet[TownName_index][date_index] = element['The number of cases']
                                // agency.push(date_index)
                            }
                        })
                    }
                })
        });
        this.data_set_from_json = DataSet
        this.LinetrendDataHandle()
        },
        // 生成折线与图表数据
        LinetrendDataHandle(){
            window.hl_line_mark = -1;
            this.series_all_sum.push({
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
                    xAxis: this.predict_label,
                    tooltip: {
                        formatter: '{b}: {c}'
                    }
                }, ],
                label: {
                    formatter: 'predict'
                },
            }
        })
            // 生成折线
            for (let i = 0; i < this.TownName_set_from_json.length; i++) {
            let series_clause = {};
            series_clause.name = this.TownName_set_from_json[i];
            series_clause.type = 'line';
            series_clause.symbol = 'diamond';
            series_clause.sampling = 'lttb';
            series_clause.itemStyle = {
                color: this.colorList[i]
            };
            series_clause.emphasis = {
                focus: 'series',
                blurScope: 'coordinateSystem'
            };
            series_clause.data = this.data_set_from_json[i];
            this.series_all_sum.push(series_clause);
            }
            // 具体时间处理
            for (let i = 1; i < 156; i++) {
            let now = new Date(this.base += this.oneMonth);
            this.date.push([now.getFullYear(), now.getMonth()].join('/'));
            this.data.push(Math.round((Math.random() - 0.5) * 10 + this.data[i - 1]));
            this.data1.push(Math.round((Math.random() - 0.4) * 50 + this.data1[i - 1]));
            this.data2.push(Math.round((Math.random() - 0.3) * 100 + this.data1[i - 1]));
            this.data3.push(Math.round((Math.random() - 0.2) * 150 + this.data1[i - 1]));
            this.data4.push(Math.round((Math.random() - 0.1) * 200 + this.data1[i - 1]));
            }
        
            this.LinetrendChartHandle()
        },
        // 配置图表数据
        LinetrendChartHandle(){
            window.linetrend_option = {
            tooltip: {},
            legend: {
                y: 'top',
                x: 'center',
                // 'scroll'：可滚动翻页的图例。当图例数量较多时可以使用。
                type: 'scroll',
                // 在legend里加上top属性，可直接写数字top：5，代表具体的5像素；也可以写top: ‘5%’，具体参考echarts官方文档配置手册里 legend。
                top: '9%',
                left: '30%',
            },

            title: {
                left: 'center',
                text: 'Number of case Monthly',
            },
            xAxis: {
                type: 'category',
                name: 'Month',
                boundaryGap: false,
                // this.data: date,
                data: this.date_set_from_json,
                axisLabel: {
                    formatter: function(value) {
                        let a = value.split("/");
                        return a[0] + '/' + a[1]
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: 'The number of case',
                // 设置最大罪行值
                min: function(value) {
                    return value.min;
                },
                max: function(value) {
                    return value.max + 10;
                }
            },
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
                    start: 0,
                    end: 100,
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
            series: this.series_all_sum
            };
            this.$store.commit('Linetrend/getLinetrend_option',window.linetrend_option)
            this.LinetrendChartRender()
        },
        // 图表渲染
        LinetrendChartRender(){
            // 使用刚指定的配置项和数据显示图表。
            window.linetrend_myChart.setOption(window.linetrend_option);

            // 把配置项给实例对象，跟着浏览器同比例缩放
            window.addEventListener('resize', function() {
                window.linetrend_myChart.resize();
            })
        }

    }
}
</script>

<style>

</style>