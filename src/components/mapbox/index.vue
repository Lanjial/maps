<template>
  <div class="home">
    <div id="map" style="height: 630px;width: 600;" ></div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import { mapState } from 'vuex';
import Exports from "../../../static/Export_Output.json"
import Cases_Number_Monthly from "../../../static/Cases_Number_Monthly.json"
import {getMapDate} from '@/api/index.js';
export default {
  name: "mapbox",
  computed:{
      ...mapState(['Exports','hoveredStateId','geojson_info','area_chosen_state','hl_line_mark','colorList','colorList_clear','relation_between_area_colorlist','name'])
  },
  data() {
    return {
        Exports:"",
    };
  },
  methods:{
      windowDateHandle(){
        window.raw_geojson_info = Exports;
        window.raw_default_area_list = [];
        window.geojson_info = new Array();
        window.area_chosen_state = new Array();
        window.relation_between_area_ID = new Array();
        window.relation_between_area_colorlist = new Array();
        window.colorList = this.colorList
        window.colorList_clear = this.colorList_clear
        
        window.raw_geojson_info.features.forEach(element => {
            window.geojson_info[element.properties.name] = element.properties.id + 1;
            window.area_chosen_state[element.id] = false;
            window.relation_between_area_ID[element.id] = element.properties.name;
            window.raw_default_area_list.push(element.properties.name)
            window.relation_between_area_colorlist[element.properties.name] = window.colorList.indexOf(window.colorList[element.properties.id])
        });

      },
      async getMapDates(){
        //   let ex = await getMapDate()
        //   console.log(ex);
        this.$axios.get("json/beijing.json").then((res) => {
              console.log("'succsss",res.data);
              console.log(Exports);
            // this.Exports = re
        }).catch((err) => {
              console.log(err);
        });
      }
  },
  created(){
    this.getMapDates()
    this.windowDateHandle()
    this.$store.commit('getGeojsoninfo', Exports)
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3l4LS0tIiwiYSI6ImNrazZhOXUxdDAyMTQyb3AyYWl1YjZ3cHMifQ.fziHVOJ-trhLKQbWTyax3g';
      let map = new mapboxgl.Map({
          container: 'map', // container id
          style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
          center: [98.41, 25.18],
          zoom: 7,
          zoom: 8
        });
        let hoveredStateId = null
        // ----红点----
        let size = 200;
        //实现CustomLayerInterface在地图上绘制一个脉冲点图标
        let pulsingDot = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),

            //当图层被添加到地图中时，获取地图画布的渲染上下文
            onAdd: function() {
                let canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                this.context = canvas.getContext('2d');
            },

            //在使用图标的每一帧之前调用一次
            render: function() {
                let duration = 1000;
                let t = (performance.now() % duration) / duration;
                let radius = (size / 2) * 0.3;
                let outerRadius = (size / 2) * 0.7 * t + radius;
                let context = this.context;
                context.beginPath();
                context.arc(
                    this.width / 2,
                    this.height / 2,
                    radius,
                    0,
                    Math.PI * 2
                );
                context.fillStyle = 'rgba(255, 100, 100, 1)';
                context.strokeStyle = 'black';
                // context.lineWidth = 2 + 4 * (1 - t);
                context.lineWidth = 4;
                context.fill();
                context.stroke();
                //使用画布中的数据更新这个图像的数据
                this.data = context.getImageData(
                    0,
                    0,
                    this.width,
                    this.height
                ).data;
                //不断重绘地图，导致圆点的平滑动画
                map.triggerRepaint();
                //返回' true '让映射知道图像被更新了
                return true;
            }
        };
        let setname = this.name
        // ----红点----
        map.on('load', function() {
            this.$store.name = '阿拉德'
            console.log('vuex获取的数据',this.colorList);
            console.log('本地data获取的数据',this.name);
            console.log('本地处理过后的数据',setname);
            map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
            map.addSource('rwanda-provinces', {
                'type': 'geojson',
                'data': Exports
                // 数据源位置（后续修改为请求返回的数据）
            });
            // 给地图添加数据
            map.addLayer({
                'id': 'rwanda-provinces',
                'type': 'fill',
                'source': 'rwanda-provinces',
                'layout': {},

                // 关于paint 设置3
                "paint": {
                    "fill-color": ["get", 'color'],
                    'fill-opacity': [
                        'case', ['boolean', ['feature-state', 'hover'], false],
                        1,
                        0.5
                    ]
                }
            });
            map.addLayer({
                'id': 'state-borders',
                'type': 'line',
                'source': 'rwanda-provinces',
                'layout': {},
                'paint': {
                    'line-color': '#627BC1',
                    'line-width': 2
                }
            });
            map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'rwanda-provinces',
                'layout': {
                    'icon-image': 'pulsing-dot',
                    "text-field": ["get", "name"],
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [0, 1.25], //设置图标与图标注相对之间的距离
                    "text-anchor": "top",
                    "icon-size": ["get", "childNum"], //图标的大小
                },
                'paint': {
                    "text-halo-color": "rgb(255,255,255)",
                    "text-halo-width": 2,
                },
            });
        window.map_muti_chosen_mark = false;
        window.mapboxDate = 'rwanda-provinces'
        console.log('data',window.mapboxDate);
        //当用户将鼠标移到状态填充层上时，我们将更新状态填充层
        //鼠标下特性的状态。
        map.on('mousemove', 'rwanda-provinces', function(e) {
                if(!window.map_muti_chosen_mark){
                     if (window.hl_line_mark != e.features[0].properties.id) {
                        // 判断鼠标当前选中的是否与window.hl_line_mark相同
                        for (let i = 0; i < window.linetrend_option.series.length - 1; i++) {
                            // if (window.linetrend_option.series[i + 1].name != e.features[0].properties.name)
                            window.linetrend_option.series[i + 1].itemStyle.color = window.colorList[i]
                            // 赋予相应的颜色
                            window.horizhist_colorlist[window.horizhist_arealist.indexOf(window.linetrend_option.series[i + 1].name)] = window.colorList[window.relation_between_area_colorlist[window.linetrend_option.series[i + 1].name]]
                        }
                        window.linetrend_myChart.setOption({ series: window.linetrend_option.series }, {
                            notMerge: false
                        });
                        
                        window.horizhist_option = {
                            title: {
                                top: '0%',
                                left: 'center',
                                text: 'Rank of Case Number',
                            },
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow'
                                }
                            },
                            grid: { containLabel: true },
                            xAxis: { name: 'amount' },
                            yAxis: {
                                type: 'category',
                                axisLabel: {
                                    show: true,
                                    textStyle: {

                                        fontSize: '9'
                                    }
                                },
                                inverse: true
                            },

                            grid: {
                                left: '11%',
                                top: '8%',
                                right: '10%',
                                bottom: '10%',


                            },
                            series: [{

                                type: 'bar',
                                encode: {

                                    x: 'amount',

                                    y: 'townname'
                                },
                                // 为每个柱子给定颜色，不够的话开始循环
                                itemStyle: {
                                    normal: {
                                        //这里是重点
                                        // 循环这样子方便点 
                                        color: function(params) {
                                            let colorList = window.horizhist_colorlist;
                                            return colorList[params.dataIndex % colorList.length];
                                        }
                                    }
                                },
                                data: window.horizhist_data_set1_from_json
                            }]
                        };
                        window.horizhist_myChart.setOption(window.horizhist_option);
                         for (let i = 0; i < window.linetrend_option.series.length - 1; i++) {
                            if (window.linetrend_option.series[i + 1].name != e.features[0].properties.name) {
                                window.linetrend_option.series[i + 1].itemStyle.color = window.colorList_clear[i]
                                window.horizhist_colorlist[window.horizhist_arealist.indexOf(window.linetrend_option.series[i + 1].name)] = window.colorList_clear[window.relation_between_area_colorlist[window.linetrend_option.series[i + 1].name]]
                            }
                        }
                        window.linetrend_myChart.setOption({ series: window.linetrend_option.series }, {
                            notMerge: false
                        });
                        window.horizhist_option = {
                            title: {
                                top: '0%',
                                left: 'center',
                                text: 'Rank of Case Number',
                            },
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow'
                                }
                            },
                            grid: { containLabel: true },
                            xAxis: { name: 'amount' },
                            yAxis: {
                                type: 'category',
                                axisLabel: {
                                    show: true,
                                    textStyle: {

                                        fontSize: '9'
                                    }
                                },
                                inverse: true
                            },

                            grid: {
                                left: '11%',
                                top: '8%',
                                right: '10%',
                                bottom: '10%',


                            },
                            series: [{

                                type: 'bar',
                                encode: {

                                    x: 'amount',

                                    y: 'townname'
                                },
                                // 为每个柱子给定颜色，不够的话开始循环
                                itemStyle: {
                                    normal: {
                                        //这里是重点
                                        // 循环这样子方便点 
                                        color: function(params) {
                                            let colorList = window.horizhist_colorlist;
                                            return colorList[params.dataIndex % colorList.length];
                                        }
                                    }
                                },
                                data: window.horizhist_data_set1_from_json
                            }]
                        };
                        window.horizhist_myChart.setOption(window.horizhist_option);
                        window.hl_line_mark = e.features[0].properties.id;
                         if (!area_chosen_state[e.features[0].id]) {
                            if (e.features.length > 0) {
                                if (hoveredStateId) {
                                    map.setFeatureState({
                                        source: 'rwanda-provinces',
                                        id: hoveredStateId
                                    }, {
                                        hover: false
                                    });
                                }
                                hoveredStateId = e.features[0].id;
                                map.setFeatureState({
                                    source: 'rwanda-provinces',
                                    id: hoveredStateId
                                }, {
                                    hover: true
                                });
                            }
                            } else {
                        if (hoveredStateId) {
                                    map.setFeatureState({
                                        source: 'rwanda-provinces',
                                        id: hoveredStateId
                                    }, {
                                        hover: false
                                    });
                        }
                    }
                }
                }
            });
        // 鼠标点击后移动到地图的提示框中，鼠标的样式变回正常模式
        map.on('mouseenter', 'rwanda-provinces', function() {
                map.getCanvas().style.cursor = 'pointer';
            });
        //当点击事件发生在状态层的一个功能上，在点击的位置，从它的属性描述HTML。
        map.on('click', 'rwanda-provinces', function(e) {
                for (let i = 0; i < window.linetrend_option.series.length - 1; i++) {
                    if (window.linetrend_option.series[i + 1].name == e.features[0].properties.name) {
                        if (area_chosen_state[e.features[0].id]) {
                            window.linetrend_option.series[i + 1].itemStyle.color = window.colorList_clear[i]
                        } else {
                            window.linetrend_option.series[i + 1].itemStyle.color = window.colorList[i]
                        }
                    }
                }
                for (let i = 0; i < window.horizhist_arealist.length; i++) {
                    if (window.horizhist_arealist[i] == e.features[0].properties.name) {
                        if (area_chosen_state[e.features[0].id]) {
                            window.horizhist_colorlist[window.horizhist_arealist.indexOf(window.horizhist_arealist[i])] = window.colorList_clear[window.relation_between_area_colorlist[window.horizhist_arealist[i]]]
                        } else {
                            window.horizhist_colorlist[window.horizhist_arealist.indexOf(window.horizhist_arealist[i])] = window.colorList[window.relation_between_area_colorlist[window.horizhist_arealist[i]]]
                        }
                    }
                }
                window.linetrend_myChart.setOption({ series: window.linetrend_option.series }, {
                    notMerge: false
                });


                window.horizhist_option = {
                    title: {
                        top: '0%',
                        left: 'center',
                        text: 'Rank of Case Number',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: { containLabel: true },
                    xAxis: { name: 'amount' },
                    yAxis: {
                        type: 'category',
                        axisLabel: {
                            show: true,
                            textStyle: {

                                fontSize: '9'
                            }
                        },
                        inverse: true
                    },

                    grid: {
                        left: '11%',
                        top: '8%',
                        right: '10%',
                        bottom: '10%',


                    },
                    series: [{

                        type: 'bar',
                        encode: {

                            x: 'amount',

                            y: 'townname'
                        },
                        // 为每个柱子给定颜色，不够的话开始循环
                        itemStyle: {
                            normal: {
                                //这里是重点
                                // 循环这样子方便点 
                                color: function(params) {
                                    let colorList = window.horizhist_colorlist;
                                    return colorList[params.dataIndex % colorList.length];
                                }
                            }
                        },
                        data: window.horizhist_data_set1_from_json
                    }]
                };
                window.horizhist_myChart.setOption(window.horizhist_option);
                if (!area_chosen_state[e.features[0].id]) {
                    hoveredStateId = e.features[0].id;
                    map.setFeatureState({
                        source: 'rwanda-provinces',
                        id: hoveredStateId
                    }, {
                        hover: true
                    });
                    area_chosen_state[e.features[0].id] = true;
                    window.map_muti_chosen_mark = true;
                    hoveredStateId = null;
                } else {
                    hoveredStateId = e.features[0].id;
                    map.setFeatureState({
                        source: 'rwanda-provinces',
                        id: hoveredStateId
                    }, {
                        hover: false
                    });
                    area_chosen_state[e.features[0].id] = false;
                    window.map_muti_chosen_mark = true;
                    // console.log(Object.values(area_chosen_state))
                    if (Object.values(area_chosen_state).indexOf(true) == -1) {
                        window.map_muti_chosen_mark = false;
                    }
                }
            });
        // //当鼠标离开状态填充层时，更新

        map.on('mouseleave', 'rwanda-provinces', function() {
                if (!window.map_muti_chosen_mark) {
                    if (window.hl_line_mark != -1) {
                        for (let i = 0; i < window.linetrend_option.series.length - 1; i++) {
                            window.linetrend_option.series[i + 1].itemStyle.color = window.colorList[i]
                            window.horizhist_colorlist[window.horizhist_arealist.indexOf(window.linetrend_option.series[i + 1].name)] = window.colorList[window.relation_between_area_colorlist[window.linetrend_option.series[i + 1].name]]
                        }
                        window.linetrend_myChart.setOption({ series: window.linetrend_option.series }, {
                            notMerge: false
                        });


                        window.horizhist_option = {
                            title: {
                                top: '0%',
                                left: 'center',
                                text: 'Rank of Case Number',
                            },
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow'
                                }
                            },
                            grid: { containLabel: true },
                            xAxis: { name: 'amount' },
                            yAxis: {
                                type: 'category',
                                axisLabel: {
                                    show: true,
                                    textStyle: {

                                        fontSize: '9'
                                    }
                                },
                                inverse: true
                            },

                            grid: {
                                left: '11%',
                                top: '8%',
                                right: '10%',
                                bottom: '10%',


                            },
                            series: [{

                                type: 'bar',
                                encode: {

                                    x: 'amount',

                                    y: 'townname'
                                },
                                // 为每个柱子给定颜色，不够的话开始循环
                                itemStyle: {
                                    normal: {
                                        //这里是重点
                                        // 循环这样子方便点 
                                        color: function(params) {
                                            let colorList = window.horizhist_colorlist;
                                            return colorList[params.dataIndex % colorList.length];
                                        }
                                    }
                                },
                                data: window.horizhist_data_set1_from_json
                            }]
                        };
                        window.horizhist_myChart.setOption(window.horizhist_option);




                        window.hl_line_mark = -1;

                    }
                }
                // 如果有选中则关闭默认的鼠标移动高亮地图功能
                if (hoveredStateId) {
                    map.setFeatureState({
                        source: 'rwanda-provinces',
                        id: hoveredStateId
                    }, {
                        hover: false
                    });
                }
                hoveredStateId = null;
                map.getCanvas().style.cursor = '';
            });
        // 操作lintrend
        // 鼠标移入时更新地图高亮状态
        window.linetrend_myChart.on('mousemove',function(param) {
            console.log('鼠标移入');
            console.log('1',param);
            let distID = window.geojson_info[param.seriesName];
            console.log('2',distID);
            if (!area_chosen_state[distID]) {
                console.log('3',area_chosen_state);
                if (distID) {
                    if (hoveredStateId) {
                        // 设置要素的状态状态,对象会与要素的现有状态合并。
                        map.setFeatureState({
                            source: 'rwanda-provinces',
                            id: hoveredStateId
                        }, {
                            hover: false
                        });
                    }
                    hoveredStateId = distID;
                    console.log(hoveredStateId);
                    map.setFeatureState({
                        source: 'rwanda-provinces',
                        id: hoveredStateId
                    }, {
                        hover: true
                    });
                }
            }
        });
        // 鼠标移出时回复正常
        window.linetrend_myChart.on('mouseout', function(param) {
            console.log('鼠标移出');
            if (hoveredStateId) {
                console.log('进入了');
                map.setFeatureState({
                    source: 'rwanda-provinces',
                    id: hoveredStateId
                }, {
                    hover: false
                });
            }
            hoveredStateId = null;
            map.getCanvas().style.cursor = '';
        });
        // 执行拖动事件
        window.linetrend_myChart.on('datazoom', function(param) {
            let xAxis = window.linetrend_myChart.getModel().option.xAxis[0];
            let start_current_data = '';
            let end_current_data = '';
            // ----------------读取和处理柱状图的数据---------------
            function refresh_horizhist_Data(Cases_Number_Monthly,start_current_data, end_current_data) {
                let data_set_from_json = [];
                let date_set_from_json = [];
                let TownName_set_from_json = [];
                let a;
                Cases_Number_Monthly.casenumbermonthly.forEach(element => {
                    a = element['Month'].split("/");
                    a = a[2] + '/' + a[0] + '/' + a[1];
                    if (Date.parse(a) >= Date.parse(start_current_data) && Date.parse(a) <= Date.parse(end_current_data)) {
                        // console.log("a = ??>>" + a)
                        TownName_set_from_json.push(element['TownName']);
                        a = element['Month'].split("/");
                        a = a[2] + '/' + a[0] + '/' + a[1];
                        date_set_from_json.push(a);
                    }
                });
                // 数组去重
                date_set_from_json = [...new Set(date_set_from_json)];
                TownName_set_from_json = [...new Set(TownName_set_from_json)];

                data_set_from_json = new Array(TownName_set_from_json.length);
                for (let i = 0; i < data_set_from_json.length; i++) {
                    data_set_from_json[i] = new Array(date_set_from_json.length);
                }
                Cases_Number_Monthly.casenumbermonthly.forEach(element => {
                    a = element['Month'].split("/");
                    a = a[2] + '/' + a[0] + '/' + a[1];
                    if (Date.parse(a) >= Date.parse(start_current_data) && Date.parse(a) <= Date.parse(end_current_data)) {
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
                    }
                });
                // console.log(data_set_from_json)
                for (let i = 0; i < data_set_from_json.length; i++) {
                    data_set_from_json[i] = eval(data_set_from_json[i].join("+"))
                }

                let data_set1_from_json = []
                    // console.log(tengchongdata.features[0])
                    // tengchongdata.features.forEach(element => {
                for (let i = 0; i < data_set_from_json.length; i++) {
                    let agency = [];
                    agency.push(data_set_from_json[i]);
                    agency.push(TownName_set_from_json[i]);
                    data_set1_from_json.push(agency)
                }
                // ------------冒泡排序法(升序)-----------

                // ------------冒泡排序法(降序)-----------
                function bubbleSort(arr) {
                    let max = arr.length - 1;
                    for (let j = 0; j < max; j++) {
                        // 声明一个变量，作为标志位
                        let done = true;
                        for (let i = 0; i < max - j; i++) {
                            if (arr[i][0] < arr[i + 1][0]) {
                                let temp = arr[i];
                                arr[i] = arr[i + 1];
                                arr[i + 1] = temp;
                                done = false;
                            }
                        }
                        if (done) {
                            break;
                        }
                    }
                    return arr;
                }
                bubbleSort(data_set1_from_json)
                window.horizhist_data_set1_from_json = data_set1_from_json

                // ----对应颜色改变
                window.horizhist_colorlist = [];
                window.horizhist_colorlist_clear = [];
                window.horizhist_arealist = [];

                for (let i = 0; i < data_set1_from_json.length; i++) {
                    // color_list.push(window.colorList[window.geojson_info[data_set1_from_json[i][1]]])
                    // window.horizhist_colorlist.push(window.colorList[window.geojson_info[data_set1_from_json[i][1]] - 1])
                    window.horizhist_colorlist.push(window.colorList[window.relation_between_area_colorlist[data_set1_from_json[i][1]]])
                    window.horizhist_arealist.push(data_set1_from_json[i][1])
                        // console.log(window.colorList[window.geojson_info[data_set1_from_json[i][1]] - 1])
                        // console.log(window.geojson_info[data_set1_from_json[i][1]])
                }
                // console.log(data_set1_from_json)
                // 查看颜色的循序
                // console.log(color_list)

                window.horizhist_option = {
                    title: {
                        top: '0%',
                        left: 'center',
                        text: 'Rank of Case Number',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: { containLabel: true },
                    xAxis: { name: 'amount' },
                    yAxis: {
                        type: 'category',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                fontSize: '9'
                            }
                        },
                        inverse: true
                    },

                    grid: {
                        left: '11%',
                        top: '8%',
                        right: '10%',
                        bottom: '10%',


                    },
                    series: [{
                        type: 'bar',
                        encode: {
                            x: 'amount',
                            y: 'townname'
                        },
                        // 为每个柱子给定颜色，不够的话开始循环
                        itemStyle: {
                            normal: {
                                //这里是重点
                                // 循环这样子方便点 
                                color: function(params) {
                                    let colorList = window.horizhist_colorlist;
                                    return colorList[params.dataIndex % colorList.length];
                                }
                            }
                        },
                        data: data_set1_from_json
                    }]
                };


                // ----如果地图有多选则重新更新------------
                if (window.map_muti_chosen_mark) {
                    for (let i = 0; i < window.horizhist_arealist.length; i++) {
                        window.horizhist_colorlist[window.horizhist_arealist.indexOf(window.horizhist_arealist[i])] = window.colorList_clear[window.relation_between_area_colorlist[window.horizhist_arealist[i]]]
                    }

                    window.horizhist_option = {
                        title: {
                            top: '0%',
                            left: 'center',
                            text: 'Rank of Case Number',
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        grid: { containLabel: true },
                        xAxis: { name: 'amount' },
                        yAxis: {
                            type: 'category',
                            axisLabel: {
                                show: true,
                                textStyle: {

                                    fontSize: '9'
                                }
                            },
                            inverse: true
                        },
                        grid: {
                            left: '11%',
                            top: '8%',
                            right: '10%',
                            bottom: '10%',
                        },
                        series: [{
                            type: 'bar',
                            encode: {
                                x: 'amount',
                                y: 'townname'
                            },
                            // 为每个柱子给定颜色，不够的话开始循环
                            itemStyle: {
                                normal: {
                                    //这里是重点
                                    // 循环这样子方便点 
                                    color: function(params) {
                                        let colorList = window.horizhist_colorlist;
                                        return colorList[params.dataIndex % colorList.length];
                                    }
                                }
                            },
                            data: window.horizhist_data_set1_from_json
                        }]
                    };
                    window.horizhist_myChart.setOption(window.horizhist_option);
                    let agency = [];
                    for (let i in window.area_chosen_state) {
                        if (window.area_chosen_state[i] == true) {
                            console.log(window.relation_between_area_ID[i]);
                            console.log(i)
                            agency.push(window.relation_between_area_ID[i])
                        }
                    }
                    console.log(agency)
                    for (let i = 0; i < agency.length; i++) {
                        window.horizhist_colorlist[window.horizhist_arealist.indexOf(agency[i])] = window.colorList[window.relation_between_area_colorlist[agency[i]]]
                    }
                    window.horizhist_option = {
                        title: {
                            top: '0%',
                            left: 'center',
                            text: 'Rank of Case Number',
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        grid: { containLabel: true },
                        xAxis: { name: 'amount' },
                        yAxis: {
                            type: 'category',
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    fontSize: '9'
                                }
                            },
                            inverse: true
                        },
                        grid: {
                            left: '11%',
                            top: '8%',
                            right: '10%',
                            bottom: '10%',
                        },
                        series: [{
                            type: 'bar',
                            encode: {
                                x: 'amount',
                                y: 'townname'
                            },
                            // 为每个柱子给定颜色，不够的话开始循环
                            itemStyle: {
                                normal: {
                                    //这里是重点
                                    // 循环这样子方便点 
                                    color: function(params) {
                                        let colorList = window.horizhist_colorlist;
                                        return colorList[params.dataIndex % colorList.length];
                                    }
                                }
                            },
                            data: window.horizhist_data_set1_from_json
                        }]
                    };
                    window.horizhist_myChart.setOption(window.horizhist_option);
                }
                let raw_default_area_list_childNum = new Array(window.horizhist_data_set1_from_json.length);
                for (let i in window.horizhist_data_set1_from_json) {
                    for (let j in window.raw_default_area_list) {
                        if (window.horizhist_data_set1_from_json[i][1] == window.raw_default_area_list[j]) {
                            raw_default_area_list_childNum[j] = window.horizhist_data_set1_from_json[i][0]
   
                        }
                    }
                }
                // 将获取的数据进行归一化处理
                let min_in_childNum = window.horizhist_data_set1_from_json[window.horizhist_data_set1_from_json.length - 1][0];
                let max_in_childNum = window.horizhist_data_set1_from_json[0][0];
                let distance_maxmin = max_in_childNum - min_in_childNum;
                for (let j in raw_default_area_list_childNum) {
                    raw_default_area_list_childNum[j] = ((raw_default_area_list_childNum[j] - min_in_childNum) / distance_maxmin) * 1.0 + 0.1
                    window.raw_geojson_info.features[j].properties.childNum = raw_default_area_list_childNum[j]
                }
                console.log(raw_default_area_list_childNum)
                map.getSource('rwanda-provinces').setData(window.raw_geojson_info);
                map.setLayoutProperty('points', 'icon-size', ["get", "childNum"]);
                // 对应变动地图的icon图标大小
                return data_set1_from_json;

            }

            // ----------------读取和处理柱状图的数据---------------

            // 如果只拉动时间轴
            if (param.dataZoomId) {
                // console.log(param.dataZoomId)
                if (param.dataZoomId.indexOf('2') != -1) {
                    end_current_data = xAxis.data[Math.round(param.end / (100 / parseInt(xAxis.data.length - 1)))]
                    start_current_data = xAxis.data[Math.round(param.start / (100 / parseInt(xAxis.data.length - 1)))]
                    window.horizhist_option.series[0].data = refresh_horizhist_Data(Cases_Number_Monthly, start_current_data, end_current_data);
                    window.horizhist_myChart.setOption(window.horizhist_option);
                }
                // 如果是对图形进行缩放
            } else {
                if (param.batch[1]) {
                    end_current_data = xAxis.data[Math.round(param.batch[1].end / (100 / parseInt(xAxis.data.length - 1)))]
                    start_current_data = xAxis.data[Math.round(param.batch[1].start / (100 / parseInt(xAxis.data.length - 1)))]
                    window.horizhist_option.series[0].data = refresh_horizhist_Data(Cases_Number_Monthly, start_current_data, end_current_data);
                    window.horizhist_myChart.setOption(window.horizhist_option);
                }
            }
        });
        })    
  },
  
};
</script>
<style scoped>

</style>
