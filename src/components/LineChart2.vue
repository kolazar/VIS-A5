<template>
  <div class="vis-component" ref="chart">
    <svg class="main-svg" :width="svgWidth" :height="svgHeight">
      <g class="chart-group" ref="chartGroup"></g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "LineChart2",
  props: {},
  data() {
    return {
      colors: [
        "#b3b2b2",
        "#e4acac",
        "#c85a5a",
        "#b0d5df",
        "#907881",
        "#985356",
        "#64acbe",
        "#627f8c",
        "#574249",
      ],
      svgWidth: 500,
      svgHeight: 500,
      svgPadding: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 100,
      },
    };
  },
  mounted() {
    this.drawLineChart2();
  },
  methods: {
    drawLineChart2() {
      if (this.$refs.chart) this.svgWidth = this.$refs.chart.clientWidth;

      let svg = d3
        .select(this.$refs.chartGroup)
        .attr(
          "transform",
          `translate(${this.svgPadding.left} ,${this.svgPadding.top})`
        );

      let x = d3
        .scaleTime()
        .domain(
          d3.extent(this.lineChartData, function (d) {
            return d.date;
          })
        )
        .range([0, this.svgWidth - this.svgPadding.left - this.svgPadding.right]);

      svg
        .append("g")
        .attr("transform", `translate(0,${
            this.svgHeight - this.svgPadding.top - this.svgPadding.bottom
          })`)
        .call(d3.axisBottom(x));


let groupByDay = d3.rollup(this.lineChartData, v => d3.mean(v, d=>d.policy),d=>d.date)


      let y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(groupByDay, function (d) {
            return d[1];
          }),
        ])
        .range([this.svgHeight- this.svgPadding.top - this.svgPadding.bottom, 0]);

      svg.append("g")
      .call(d3.axisLeft(y));

// let lineChart2DataByCountry = d3.group(this.lineChart2Data, d=>d.date)
      svg
        .append("path")
        .datum(groupByDay)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
             return x(d[0])
            })
            .y(function (d) {
              return y(d[1]);
            }))
        

      // .append("title")
      // .text((d) => {
      //   return `${d.countryName}`;
      // });
    },
  },
  computed: {
    lineChartData: {
      get() {
        return this.$store.getters.lineChartData;
      },
    },
  },

  watch: {
    lineChartData: {
      handler() {
        this.drawLineChart2();
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>
