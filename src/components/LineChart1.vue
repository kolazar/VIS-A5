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
    };
  },
  mounted() {
    this.drawAllCountriesLine();
    // this.createTooltip();
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
            .x((d) => this.x(d3.timeParse("%m/%Y")(d[0])))
            .y((d) => this.y(d[1]))
          // .curve(d3.curveBasis)
        );

      this.drawXAxis();
      this.drawYAxisAllCountries();
      // this.drawAllCountriesCircles();

      // d3.select(".focus").remove();
      // d3.select(".overlay").remove();

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

    //draw dots on the line chart

    // drawAllCountriesCircles() {
    //   let circlesGroup = this.svg
    //     .selectAll("circle")
    //     .data(this.groupByMonthYearAllCountries);

    //   circlesGroup.exit().remove();
    //   circlesGroup
    //     .enter()
    //     .append("circle")
    //     .attr("class", "all-countries-circles")
    //     .attr("r", 4)
    //     .attr("fill", "steelblue")
    //     .attr("stroke", "steelblue")
    //     .merge(circlesGroup)
    //     .attr("cx", (d) => {
    //       return this.x(d3.timeParse("%m/%Y")(d[0]));
    //     })
    //     .attr("cy", (d) => this.y(d[1]))
    //     .on("mouseover", () =>
    //       this.handleCircleMouseHover(this.groupByMonthYearArrayAllCountries)
    //     )
    //     .on("click", () =>
    //       this.mouseClick(this.groupByMonthYearArrayAllCountries)
    //     );
    // },
    // handleCircleMouseHover(data) {
    //   this.svg
    //     .selectAll("circle")
    //     .data(data)
    //     .append("title")
    //     .text((d) => {
    //       return `${d.date}, ${this.formatValue(d.value)}`;
    //     });
    // },
    drawXAxis() {
      d3.select(".axis-x").remove();

      this.svg
        .append("g")
        .attr("class", "line1-axis-x")
        .attr(
          "transform",
          `translate(0,${
            this.svgHeight - this.svgPadding.top - this.svgPadding.bottom
          })`
        )
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

      let newMaxData = this.maxYSpecificCountry;

      if (this.maxData < newMaxData) {
        this.maxData = newMaxData;
        this.drawYAxisSpecificCountry();
      }

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
              return this.ySpecificCountry(d[2]);
            })
            .curve(d3.curveLinear)
        );
      this.drawYAxisSpecificCountry();
      this.drawVoronoi(this.voronoiData);

      // this.drawSpecificCountryCircles();
    },
    // drawSpecificCountryCircles() {
    //   let circlesGroup = this.svg
    //     .selectAll("circle")
    //     .data(this.groupByMonthYearSpecificCountry);

    //   circlesGroup.exit().remove();
    //   circlesGroup
    //     .enter()
    //     .append("circle")
    //     .attr("class", (d) => {
    //       let [key] = d.entries();
    //       let nestedMap = key[1];

    //       let [isoCode] = nestedMap.entries();

    //       return `path-${isoCode[0]}`;
    //     })
    //     .attr("r", 4)
    //     .attr("fill", "steelblue")
    //     .attr("stroke", "steelblue")
    //     .merge(circlesGroup)
    //     .attr("cx", (d) => {
    //       return this.x(d3.timeParse("%m/%Y")(d[0]));
    //     })
    //     .attr("cy", (d) => {
    //       let nestedMap = d[1];
    //       let [value] = nestedMap.entries();

    //       return this.ySpecificCountry(value[1]);
    //     })
    //     .on("mouseover", () =>
    //       this.handleCircleMouseHoverSpecificCountry(
    //         this.groupByMonthYearSpecificCountry
    //       )
    //     )
    //     .on("click", () =>
    //       this.mouseClick(this.groupByMonthYearArrayAllCountries)
    //     );
    // },
    // handleCircleMouseHoverSpecificCountry(data) {
    //   this.svg
    //     .selectAll("circle")
    //     .data(data)
    //     .append("title")
    //     .text((d) => {
    //       let [key] = d.entries();
    //       let nestedMap = key[1];

    //       let [isoCode] = nestedMap.entries();

    //       return `${isoCode[0]},${d.date}, ${this.formatValue(d.value)}`;
    //     });
    // },

    drawYAxisSpecificCountry() {
      d3.select(".axis-y-specific").remove();

      this.svg
        .append("g")
        .attr("class", "axis-y-specific")
        .call(d3.axisLeft(this.ySpecificCountry))
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

      if (!this.selectedCountries.length) {
        this.drawAllCountriesLine();
        this.drawYAxisAllCountries();
      }
    },
    drawVoronoi(data) {
      d3.select(".voronoi").remove();
      let points = data.map((d) => {
        return [
        this.x(this.dateParser(d[0])),
        this.yAllData(d[2]),
      ]});
      let delaunay = d3.Delaunay.from(points);
      let voronoi = delaunay.voronoi([
        0,
        0,
        this.svgWidth - this.svgPadding.left - this.svgPadding.right,
        this.svgHeight - this.svgPadding.top - this.svgPadding.bottom,
      ]);

      let voronoiGroup = this.svg.append("g").attr("class", "voronoi");

      points.map((point, i) => {
        return voronoiGroup
          .append("path")

          .attr("fill", "none")
          .attr("stroke", "pink")
          .attr(
            "d",

            voronoi.renderCell(i)
          );
      });
    },

    createTooltip() {
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

      this.focus
        .append("text")
        .attr("x", -150)
        .attr("y", 18)
        .text("New Cases:");

      this.focus
        .append("text")
        .attr("class", "tooltip-info")
        .attr("x", -70)
        .attr("y", 18);

      this.svg
        .append("rect")
        .attr("class", "overlay")
        .attr(
          "width",
          this.svgWidth - this.svgPadding.left - this.svgPadding.right
        )
        .attr(
          "height",
          this.svgHeight - this.svgPadding.top - this.svgPadding.bottom
        )
        .on("mouseover", () => this.focus.style("display", null))
        .on("mouseout", () => this.focus.style("display", "none"))
        .on("mousemove", () =>
          this.mouseMove(this.groupByMonthYearArrayAllCountries)
        )
        .on("click", () =>
          this.mouseClick(this.groupByMonthYearArrayAllCountries)
        );
    },
    mouseMove(data) {
      let x0 = this.x.invert(d3.pointer(event)[0]),
        bisectDate = d3.bisector((d) => {
          return this.dateParser(d.date);
        }).left,
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d =
          x0 - this.dateParser(d0.date) > this.dateParser(d1.date) - x0
            ? d1
            : d0;
      this.focus
        .attr(
          "transform",
          "translate(" +
            this.x(this.dateParser(d.date)) +
            "," +
            this.y(d.value) +
            ")"
        )
        .select(".tooltip-date")
        .text(d.date);
      this.focus.select(".tooltip-info").text(this.formatValue(d.value));
    },
    mouseClick(data) {
      let x0 = this.x.invert(d3.pointer(event)[0]),
        bisectDate = d3.bisector((d) => this.dateParser(d.date)).left,
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d =
          x0 - this.dateParser(d0.date) > this.dateParser(d1.date) - x0
            ? d1
            : d0;

      this.$store.commit("changeSelectedDate", d.date);
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
yAllData(){
return d3
        .scaleLinear()
        .domain([0, d3.max(this.voronoiData, (d) => d[2])])
        .range([
          this.svgHeight - this.svgPadding.top - this.svgPadding.bottom,
          0,
        ])
        .nice();
},
    groupByMonthYearAllCountries() {
      return d3.rollup(
        this.data,
        (v) =>
          d3.sum(v, (d) => {
            if (typeof d.newCasesSmoothedMillion !== "undefined")
              return d.newCasesSmoothedMillion;
          }),
        (d) => d.monthYear
      );
    },
    groupByMonthYearArrayAllCountries() {
      return Array.from(this.groupByMonthYearAllCountries, ([date, value]) => ({
        date,
        value,
      }));
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
          d3.extent(this.groupByMonthYearArrayAllCountries, (d) =>
            d3.timeParse("%m/%Y")(d.date)
          )
        )
        .range([
          0,
          this.svgWidth - this.svgPadding.left - this.svgPadding.right,
        ]);
    },

    y() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.groupByMonthYearAllCountries, (d) => d[1])])
        .range([
          this.svgHeight - this.svgPadding.top - this.svgPadding.bottom,
          0,
        ])
        .nice();
    },

    maxYSpecificCountry() {
      return d3.max(this.groupByMonthYearSpecificCountry, (d) => {
        return d[2];
      });
    },

    ySpecificCountry() {
      return d3
        .scaleLinear()
        .domain([0, this.maxYSpecificCountry])
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
        .style("display", "none")
        .raise();
    },
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

circle {
  cursor: pointer;
}
</style>
