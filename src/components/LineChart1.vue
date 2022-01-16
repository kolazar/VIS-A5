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
  name: "LineChart1",
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
    this.drawLineChart1();
  },
  methods: {
    drawLineChart1() {
      if (this.$refs.chart) this.svgWidth = this.$refs.chart.clientWidth;

      // d3.select(".focus").remove();
      // d3.select(".overlay").remove();

      this.svg
        .append("g")
        .attr(
          "transform",
          `translate(0,${
            this.svgHeight - this.svgPadding.top - this.svgPadding.bottom
          })`
        )
        .call(d3.axisBottom(this.x));

      this.svg
        .append("g")
        .call(d3.axisLeft(this.y))
        .raise()
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("class", "yaxis")
        .attr("x", -6)
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .text("New Cases Smoothed per Million");

      /*
Grouping data for two lines representing newCasesSmoothedMillion and newVaccinesSmoothedMillion
*/

      // let valuesToSum = ["newCasesSmoothedMillion", "newVaccinesSmoothedMillion"];

      // let groupByDayMap = d3.rollup(
      //   this.lineChart1Data,
      //   (v) =>
      //     Object.fromEntries(
      //       valuesToSum.map((col) => [col, d3.sum(v, (d) => d[col])])
      //     ),
      //   (d) => d.date
      // );

      // let normalized = (groupByDayMap, d=>{return (d[1].newCasesSmoothedMillion-d3.min(groupByDayMap[1].newCasesSmoothedMillion))/(d3.max(groupByDayMap[1].newCasesSmoothedMillion)-d3.min(groupByDayMap[1].newCasesSmoothedMillion))})
      // console.log(normalized);

      this.svg
        .append("path")
        .datum(this.groupByDayMap)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x((d) => {
              return this.x(d[0]);
            })
            .y((d) => {
              return this.y(d[1]);
              // return y(d[1].newCasesSmoothedMillion);
            })
        );

      // .append("title")
      // .text((d) => {
      //   return `${d[1]}`;
      // });

      this.focus.append("circle").attr("r", 5);

      this.focus
        .append("rect")
        .attr("class", "tooltip-frame")
        .attr("width", 150)
        .attr("height", 50)
        .attr("x", -160)
        .attr("y", -22)
        .attr("rx", 4)
        .attr("ry", 4);

      this.focus
        .append("text")
        .attr("class", "tooltip-date")
        .attr("x", -150)
        .attr("y", -2);

      this.focus.append("text").attr("x", -150).attr("y", 18).text("New Cases:");

      this.focus
        .append("text")
        .attr("class", "tooltip-info")
        .attr("x", -70)
        .attr("y", 18);

      this.svg
        .append("rect")
        .attr("class", "overlay")
        .attr("width", this.svgWidth)
        .attr("height", this.svgHeight)
        .on("mouseover", () => this.focus.style("display", null))
        .on("mouseout", () => this.focus.style("display", "none"))
        .on("mousemove", () => this.mouseMove(this.groupByDayArray))
        .on("click", ()=>this.mouseClick(this.groupByDayArray));

      // svg
      //   .append("path")
      //   .datum(groupByDayMap)
      //   .attr("fill", "none")
      //   .attr("stroke", "red")
      //   .attr("stroke-width", 1.5)
      //   .attr(
      //     "d",
      //     d3
      //       .line()
      //       .x(function (d) {
      //         return x(d[0]);
      //       })
      //       .y(function (d) {
      //         return y(d[1].newVaccinesSmoothedMillion);
      //       })
      //   )

      //   .append("title")
      //   .text((d) => {
      //     return `${d[1]}`;
      //   });
    },
    mouseMove(data) {

      let formatValue = d3.format(",.0f");
      let dateFormatter = d3.timeFormat("%d/%m/%Y");
      let x0 = this.x.invert(d3.pointer(event)[0]),
        bisectDate = d3.bisector((d) => {
          return d.date;
        }).left,
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;

      this.focus
        .attr(
          "transform",
          "translate(" + this.x(d.date) + "," + this.y(d.value) + ")"
        )
        .select(".tooltip-date")
        .text(dateFormatter(d.date));
      this.focus.select(".tooltip-info").text(formatValue(d.value));
    },
    mouseClick(data){
let x0 = this.x.invert(d3.pointer(event)[0]),
        bisectDate = d3.bisector((d) => {
          return d.date;
        }).left,
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;


      this.$store.commit("changeSelectedMonth", d.date);



    }
  },
  computed: {
    lineChart1Data: {
      get() {
        return this.$store.getters.lineChartData;
      },
    },
    groupByDayMap() {
      return d3.rollup(
        this.lineChart1Data,
        (v) =>
          d3.sum(v, (d) => {
            if (typeof d.newCasesSmoothedMillion !== "undefined")
              return d.newCasesSmoothedMillion;
          }),
        (d) => d.date
      );
    },
    groupByDayArray(){
  let array = Array.from(this.groupByDayMap, ([date, value]) => ({ date, value }));
  return array;
    },


    svg() {
      return d3
        .select(this.$refs.chartGroup)
        .attr(
          "transform",
          `translate(${this.svgPadding.left} ,${this.svgPadding.top})`
        );
    },
    x() {
      return d3
        .scaleTime()
        .domain(
          d3.extent(this.lineChart1Data, function (d) {
            return d.date;
          })
        )
        .range([
          0,
          this.svgWidth - this.svgPadding.left - this.svgPadding.right,
        ]);
    },

    y() {
      return d3
        .scaleLinear()
        .domain([
          0,
          // d3.max(groupByDayMap, function (d) {
          //  return d[1].newCasesSmoothedMillion > d[1].newVaccinesSmoothedMillion ? d[1].newCasesSmoothedMillion : d[1].newVaccinesSmoothedMillion
          // }),
          d3.max(this.groupByDayMap, (d) => d[1]),
        ])
        .range([
          this.svgHeight - this.svgPadding.top - this.svgPadding.bottom,
          0,
        ])
        .nice();
    },

    

    focus() {
      return this.svg
        .append("g")
        .attr("class", "focus")
        .style("display", "none");
    },

    // bisectDate() {
    //   return d3.bisectLeft((d) => d.date);
    // },
  },

  watch: {
    lineChart1Data: {
      handler() {
        this.drawLineChart1();
      },
      deep: true,
    },
  },
};
</script>

<style>
.focus circle {
  fill: steelblue;
}

.focus text {
  font-size: 14px;
}

.tooltip-frame {
  fill: white;
  stroke: #000;
}

.tooltip-date,
.tooltip-info {
  font-weight: bold;
}

.overlay {
  fill: none;
  pointer-events: all;
}
</style>
