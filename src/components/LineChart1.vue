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
      svgWidth: 500,
      svgHeight: 500,
      svgPadding: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 100,
      },
      maxData: 0,
      circleRadius: 5,
      epsilon: 1
    };
  },
  mounted() {
    this.drawAllCountriesLine();
  },
  methods: {
    drawAllCountriesLine() {
      if (this.$refs.chart) this.svgWidth = this.$refs.chart.clientWidth;

      this.svg
        .append("g")
        .attr("class", "all-countries")

        .append("path")
        .datum(this.groupByMonthYearAllCountries)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x((d) => this.x(this.dateParser(d[0])))
            .y((d) => this.y(d[1]))
          // .curve(d3.curveBasis)
        );

      this.drawXAxis();
      this.drawYAxisAllCountries();
      this.drawVoronoiAllCountries(this.groupByMonthYearAllCountries);

      /*
Grouping data for two lines representing newCasesSmoothedMillion and newVaccinesSmoothedMillion
*/

      // let valuesToSum = ["newCasesSmoothedMillion", "newVaccinesSmoothedMillion"];

      // let groupByDayMap = d3.rollup(
      //   this.data,
      //   (v) =>
      //     Object.fromEntries(
      //       valuesToSum.map((col) => [col, d3.sum(v, (d) => d[col])])
      //     ),
      //   (d) => d.date
      // );

      // let normalized = (groupByDayMap, d=>{return (d[1].newCasesSmoothedMillion-d3.min(groupByDayMap[1].newCasesSmoothedMillion))/(d3.max(groupByDayMap[1].newCasesSmoothedMillion)-d3.min(groupByDayMap[1].newCasesSmoothedMillion))})
      // console.log(normalized);

      // .append("title")
      // .text((d) => {
      //   return `${d[1]}`;
      // });

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

    drawXAxis() {
      d3.select(".axis-x").remove();

      this.svg
        .append("g")
        .attr("class", "line1-axis-x")
        .attr("transform", `translate(0,${this.innerHeight})`)
        .call(d3.axisBottom(this.x));
    },

    drawYAxisAllCountries() {
      d3.select(".line1-axis-y-all").remove();
      d3.select(".axis-y-specific").remove();

      this.svg
        .append("g")
        .attr("class", "line1-axis-y-all")
        .call(d3.axisLeft(this.y))
        .raise()
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -6)
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .text("New Cases Smoothed per Million");
    },

    drawOneCountryLine() {
      d3.select(".line1-axis-y-all").remove();
      d3.selectAll(".all-countries").remove();

      // let newMaxData = this.maxYSpecificCountry;

      // if (this.maxData < newMaxData) {
      //   this.maxData = newMaxData;
      //   // this.drawYAxisSpecificCountry();
      // }

      // let groupedVoronoiData = d3.rollup(
      //   this.data,
      //   (v) => d3.sum(v, (d) => d.newCasesSmoothedMillion),
      //   (d) => d.monthYear
      // );

      this.svg
        .append("path")
        .datum(this.groupByMonthYearSpecificCountry)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("class", (d) => {
          return `path-${d[1][1]}`;
        })
        .attr(
          "d",
          d3
            .line()
            .x((d) => this.x(this.dateParser(d[0])))
            .y((d) => {
              return this.yGroupByMonthYearCountryAllCountries(d[2]+this.epsilon);
          
            })
            .curve(d3.curveLinear)
        );

      // let x = this.x
      // let y = this.y
      // let dateParser = this.dateParser
      //       this.svg
      //         .selectAll(".line")
      //         .data(groupedVoronoiData)
      //         .join("path")
      //         .attr("fill", "none")
      //         .attr("stroke", "steelblue")
      //         .attr("stroke-width", 1.5)
      //         .attr("d", function (d) {
      //           return d3
      //             .line()
      //             .x(function (d) {

      //               return x(dateParser(d.monthYear));
      //             })
      //             .y(function (d) {

      //               return y(d.newCasesSmoothedMillion);
      //             })(d[1]);
      //         });

      this.drawYAxisSpecificCountry();

      this.drawVoronoi(this.voronoiData);
    },

    drawYAxisSpecificCountry() {
      d3.select(".axis-y-specific").remove();

      this.svg
        .append("g")
        .attr("class", "axis-y-specific")
        // .call(d3.axisLeft(this.ySpecificCountry))
        .call(d3.axisLeft(this.yGroupByMonthYearCountryAllCountries))
        .raise()
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -6)
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .text("New Cases Smoothed per Million");
    },

    deleteOneCountryLine() {
      d3.select(`.path-${this.countryToDelete}`).remove();
      this.deleteVoronoi()
      this.drawVoronoi(this.voronoiData)

      if (!this.selectedCountries.length) {
        this.drawAllCountriesLine();
        this.drawYAxisAllCountries();
      }
    },
    deleteVoronoi(){
d3.select(".voronoi").remove();
    },

    drawVoronoiAllCountries(data) {
      this.deleteVoronoi()
      let points = data.map((d) => {
        return [this.x(this.dateParser(d[0])), this.y(d[1])];
      });
      let delaunay = d3.Delaunay.from(points);
      let voronoi = delaunay.voronoi([0, 0, this.innerWidth, this.innerHeight]);

      let voronoiGroup = this.svg.append("g").attr("class", "voronoi");

      points.map((point, i) => {
        return voronoiGroup
          .append("path")
          .on("mouseover", () => this.onHoverVoronoiAllCountries(data[i]))
          .on("click", () => this.mouseClick(this.groupByMonthYearAllCountries))
          .attr("stroke", "pink")
          .attr(
            "d",

            voronoi.renderCell(i)
          );
      });
    },

    onHoverVoronoiAllCountries(data) {
      d3.selectAll("path").attr("id", "not-active");
      d3.selectAll(".voronoi g").remove();

      d3.select(`all-countries`).attr("id", "active");

      let lineChartTooltip = d3
        .select(".voronoi")
        .append("g")
        .attr(
          "transform",
          `translate(${this.x(this.dateParser(data[0]))},
          ${this.y(data[1])})`
        );

      lineChartTooltip.append("circle").attr("r", this.circleRadius);
      // .on("click", () =>
      //   this.mouseClick(this.groupByMonthYearAllCountries)
      // );

      lineChartTooltip
        .append("text")
        .text(`${data[0]},${this.formatValue(data[1])} `);
    },

    drawVoronoi(data) {
this.deleteVoronoi()
let points = data.map((d) => {
        return [
          this.x(this.dateParser(d[0])),
          this.yGroupByMonthYearCountryAllCountries(d[3]+this.epsilon),
        ];
      });
      let delaunay = d3.Delaunay.from(points);
      let voronoi = delaunay.voronoi([0, 0, this.innerWidth, this.innerHeight]);

      let voronoiGroup = this.svg.append("g").attr("class", "voronoi");

      points.map((point, i) => {
        return voronoiGroup
          .append("path")
          .on("mouseover", () => this.onHoverVoronoi(data[i]))
          .on("click", () =>
            this.mouseClick(this.groupByMonthYearAllCountries)
          )
          .attr("stroke", "pink")
          .attr(
            "d",

            voronoi.renderCell(i)
          );
      });
    },

    onHoverVoronoi(data) {
      d3.selectAll("path").attr("id", "not-active");
      d3.selectAll(".voronoi g").remove();

      d3.select(`.path-${data[1]}`).attr("id", "active");

      let lineChartTooltip = d3
        .select(".voronoi")
        .append("g")
        .attr(
          "transform",
          `translate(${this.x(this.dateParser(data[0]))},
          ${this.yGroupByMonthYearCountryAllCountries(data[3]+this.epsilon)})`
        );

      //  lineChartTooltip.append("rect")
      // .attr("class", "tooltip-frame")
      // .attr("width", 150)
      // .attr("height", 50)

      lineChartTooltip.append("circle").attr("r", this.circleRadius);
      // .on("click", () =>
      //   this.mouseClick(this.groupByMonthYearAllCountries)
      // );

      lineChartTooltip
        .append("text")
        .text(`${data[0]},${data[2]},${this.formatValue(data[3])} `);
      // .attr("x", -70)
      //   .attr("y", 18);
    },

    mouseClick(data) {
      console.log(data);
      let x0 = this.x.invert(d3.pointer(event)[0]),
        bisectDate = d3.bisector((d) => this.dateParser(d[0])).left,
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - this.dateParser(d0[0]) > this.dateParser(d1[0]) - x0 ? d1 : d0;

      this.$store.commit("changeSelectedDate", d[0]);
    },
  },

  computed: {
    data: {
      get() {
        return this.$store.getters.lineChart1Data;
      },
    },

    lineSpecificCountryData: {
      get() {
        return this.$store.getters.lineSpecificCountryData;
      },
    },

    selectedCountries: {
      get() {
        return this.$store.getters.selectedCountries;
      },
    },
    countryToAdd: {
      get() {
        return this.$store.getters.countryToAdd;
      },
    },
    countryToDelete: {
      get() {
        return this.$store.getters.countryToDelete;
      },
    },
    voronoiData: {
      get() {
        return this.$store.getters.voronoiData;
      },
    },
    activeCountryLineChart1: {
      get() {
        return this.$store.getters.activeCountryLineChart1;
      },
    },

    innerHeight() {
      return this.svgHeight - this.svgPadding.top - this.svgPadding.bottom;
    },
    innerWidth() {
      return this.svgWidth - this.svgPadding.left - this.svgPadding.right;
    },
    svg() {
      return d3
        .select(this.$refs.chartGroup)
        .attr(
          "transform",
          `translate(${this.svgPadding.left} ,${this.svgPadding.top})`
        );
    },

    groupByMonthYearAllCountries() {
      return d3.flatRollup(
        this.data,
        (v) =>
          d3.sum(v, (d) => {
            if (typeof d.newCasesSmoothedMillion !== "undefined")
              return d.newCasesSmoothedMillion;
          }),
        (d) => d.monthYear
      );
    },

    groupByMonthYearSpecificCountry() {
      return d3.flatRollup(
        this.lineSpecificCountryData,
        (v) =>
          d3.sum(v, (d) => {
            if (typeof d.newCasesSmoothedMillion !== "undefined")
              return d.newCasesSmoothedMillion;
          }),
        (d) => d.monthYear,
        (d) => d.isoCode
      );
    },
    groupByMonthYearCountryAllCountries(){
return d3.flatRollup(
        this.data,
        (v) =>
          d3.sum(v, (d) => {
            if (typeof d.newCasesSmoothedMillion !== "undefined")
              return d.newCasesSmoothedMillion;
          }),
        (d) => d.monthYear,
        (d) => d.isoCode
      );
       
    },

    x() {
      return d3
        .scaleTime()
        .domain(
          d3.extent(this.groupByMonthYearAllCountries, (d) =>
            this.dateParser(d[0])
          )
        )
        .range([0, this.innerWidth]);
    },

    y() {
      return d3
        .scaleLog()
        .domain([this.epsilon, d3.max(this.groupByMonthYearAllCountries, (d) => d[1])])
        .range([this.innerHeight, 0])
        .nice();
    },
    yGroupByMonthYearCountryAllCountries() {
      

      return d3
        .scaleLog()
        .domain([this.epsilon, d3.max(this.groupByMonthYearCountryAllCountries, (d) => d[2])])
        .range([this.innerHeight, 0])
        .nice();
    },

    // maxYSpecificCountry() {
    //   return d3.max(this.groupByMonthYearSpecificCountry, (d) => {
    //     return d[2];
    //   });
    // },

    // ySpecificCountry() {
    //   return d3
    //     .scaleLinear()
    //     .domain([0, this.maxYSpecificCountry])
    //     .range([this.innerHeight, 0]);
    //   // .nice();
    // },

    dateParser() {
      return d3.timeParse("%m/%Y");
    },
    formatValue() {
      return d3.format(",.0f");
    },
  },

  watch: {
    data: {
      handler() {
        this.drawAllCountriesLine();
      },
      deep: true,
    },

    countryToAdd: {
      handler() {
        if (this.countryToAdd !== "") {
          this.drawOneCountryLine();
        }
      },
      deep: true,
    },
    countryToDelete: {
      handler() {
        if (this.countryToDelete !== "") {
          this.deleteOneCountryLine();
        }
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

#active {
  stroke: #000;
}
#none {
  stroke: #000;
}

circle {
  cursor: pointer;
}

.voronoi path {
  fill: none;
  pointer-events: all;
}
</style>
