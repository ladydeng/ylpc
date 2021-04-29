<template>
  <div id="app">
    <div class="header">
      {{ this.$route.query.data.staffName }}的个人图表信息
    </div>
    <div
      id="main"
      style="width: 600px; height: 400px; margin: 40px; float: left"
    ></div>
    <div
      id="line"
      style="width: 600px; height: 400px; margin: 40px; float: left"
    ></div>
  </div>
</template>

<script>
/**
 * Copyright: Copyright (c) 2020 云邻信息科技
 *
 * @templateName: echarts.vue
 * @Description: 统计图表
 *
 * @version: v1.0.0
 * @author: qcc
 * @date: 2021年02月24日 上午9:45:17
 *
 * Modification History:<br>
 * Date             Author          Version            Description
 *---------------------------------------------------------*<br>
 * 2020年02月24日     qcc           v1.0.0              统计图表页面
 *
 */
export default {
  name: "Echarts",
  data() {
    return {
      curData: [], // 柱状图列表
      linecurData: [], // 折线图
    };
  },
  methods: {
    drawChart() {
      var app = {};

      var chartDom = document.getElementById("main");
      var myChart = this.$echarts.init(chartDom);
      var option;

      var posList = [
        // 'left', 'right', 'top', 'bottom',
        // 'inside',
        // 'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
        // 'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
      ];

      app.configParameters = {
        // rotate: {
        //     min: -90,
        //     max: 90
        // },
        // align: {
        //     options: {
        //         left: 'left',
        //         center: 'center',
        //         right: 'right'
        //     }
        // },
        // verticalAlign: {
        //     options: {
        //         top: 'top',
        //         middle: 'middle',
        //         bottom: 'bottom'
        //     }
        // },
        // position: {
        //     options: posList.reduce(function (map, pos) {
        //         map[pos] = pos;
        //         return map;
        //     }, {})
        // },
        // distance: {
        //     min: 0,
        //     max: 100
        // }
      };

      app.config = {
        // rotate: 90,
        // align: 'left',
        // verticalAlign: 'middle',
        // position: 'insideBottom',
        // distance: 15,
        onChange: function () {
          var labelOption = {
            normal: {
              // rotate: app.config.rotate,
              // align: app.config.align,
              // verticalAlign: app.config.verticalAlign,
              // position: app.config.position,
              // distance: app.config.distance
            },
          };
          myChart.setOption({
            // series: [{
            //     label: labelOption
            // }, {
            //     label: labelOption
            // }, {
            //     label: labelOption
            // }, {
            //     label: labelOption
            // }]
          });
        },
      };

      var labelOption = {
        show: false,
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate,
        formatter: "{c}  {name|{a}}",
        fontSize: 16,
        rich: {
          name: {},
        },
      };

      option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["制度监督", "绩效收集", "部门协作", "意见收集", "临时工作"],
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
          feature: {
            // mark: {show: true},
            // dataView: {show: true, readOnly: false},
            // // magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            // restore: {show: true},
            // saveAsImage: {show: true}
          },
        },
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: this.$route.query.data.timeUnit,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: this.curData,
      };

      option && myChart.setOption(option);
    },
    lineDrawChart() {
      var chartDom = document.getElementById("line");
      var myChart = this.$echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: "",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["制度监督", "绩效收集", "部门协作", "意见收集", "临时工作"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            // saveAsImage: {}
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.$route.query.data.timeUnit,
        },
        yAxis: {
          type: "value",
        },
        series: this.linecurData,
        // series: [
        //     {
        //         name: '成交人数',
        //         type: 'line',
        //         // stack: '总量',
        //         data: [120, 132, 101, 134, 90, 230, 210]
        //     },
        //     {
        //         name: '咨询人数',
        //         type: 'line',
        //         // stack: '总量',
        //         data: [220, 182, 191, 234, 290, 330, 310]
        //     },
        //     {
        //         name: '上门人数',
        //         type: 'line',
        //         // stack: '总量',
        //         data: [150, 232, 201, 154, 190, 330, 410]
        //     },
        //     {
        //         name: '回访人数',
        //         type: 'line',
        //         // stack: '总量',
        //         data: [320, 332, 301, 334, 390, 330, 320]
        //     },
        // ]
      };
      option && myChart.setOption(option);
    },
  },
  mounted() {
    console.log(this.$route.query.data);
    var curData = [];
    var linecurData = [];
    if (this.$route.query.data.series != undefined) {
      this.$route.query.data.series.forEach((item, index) => {
        curData.push(Object.assign({}, item, { type: "bar" }));
      });
      if (this.$route.query.data.series != undefined) {
        this.$route.query.data.series.forEach((item, index) => {
          linecurData.push(Object.assign({}, item, { type: "line" }));
        });
      }

      this.curData = curData;
      this.linecurData = linecurData;
      console.log(this.$route.query.data.series);
      console.log(linecurData);
      console.log(this.linecurData);
      // console.log(curData);
      // console.log(this.$route.query.data.series);
      console.log("curdata", this.curData);
      this.drawChart();
      this.lineDrawChart();
    }
  },
};
</script>


<style>
body {
  background: #f0f2f5;
}
.header {
  font-size: 23px;
  margin-top: 20px;
}
</style>