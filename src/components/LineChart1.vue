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
      circleRadius: 5,
      epsilon: 1,
    };
  },
  mounted() {
    this.drawAllCountriesLine();
  },
  methods: {
    drawAllCountriesLine() {
      if (this.$refs.chart) this.svgWidth = this.$refs.chart.clientWidth;

      this.svg.selectAll("path").remove();

      this.svg
        .append("g")

        .append("path")
        .datum(this.groupByMonthYearAllCountriesVaccinesCases)
        .attr("class", "all-countries")
        .attr("id", "cases")

        .attr("fill", "none")
        .attr("stroke", "#062f5c")
        .attr("stroke-width", 2.5)
        .attr("stroke-linecap", "round")
        .attr(
          "d",
          d3
            .line()
            .x((d) => this.x(this.dateParser(d[0])))
            .y((d) => this.y(d[1].newCasesSmoothedMillion))
            .curve(d3.curveLinear)
        );

      this.svg
        .append("g")

        .append("path")
        .datum(this.groupByMonthYearAllCountriesVaccinesCases)
        .attr("class", "all-countries")
        .attr("id", "vaccines")
        .attr("fill", "none")
        .attr("stroke", "#9e0a2f")
        .attr("stroke-width", 2.5)
        .attr(
          "d",
          d3
            .line()
            .x((d) => this.x(this.dateParser(d[0])))
            .y((d) => this.y(d[1].newVaccinesSmoothedMillion + this.epsilon))
            .curve(d3.curveLinear)
        );

      let totalLength = this.svg.select(`#cases`).node().getTotalLength();


     this.svg.select(`#cases`)
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .attr("id", "active-cases")
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      totalLength = this.svg.select(`#vaccines`).node().getTotalLength();

     this.svg.select(`#vaccines`)
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .attr("id", "active-vaccines")
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      this.drawXAxis();
      this.drawYAxisAllCountries();
      this.drawVoronoiAllCountries(
        this.groupByMonthYearAllCountriesVaccinesCases
      );
    },

    drawXAxis() {
      this.svg.select(".line1-axis-x").remove();

      this.svg
        .append("g")
        .attr("class", "line1-axis-x")
        .attr("transform", `translate(0,${this.innerHeight})`)
        .call(d3.axisBottom(this.x));
    },

    drawYAxisAllCountries() {
    this.svg.select(".line1-axis-y-all").remove();
      this.svg.select(".axis-y-specific").remove();

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
        .text("New Cases/Vaccines Smoothed per Million");
    },

    drawOneCountryLine() {
     this.svg.select(".line1-axis-y-all").remove();
      this.svg.selectAll(".all-countries").remove();

      this.svg
        .append("path")
        .datum(this.groupByMonthYearSpecificCountryVaccinesCases)
        .attr("fill", "none")
        .attr("stroke", "#78a4d3")
        .attr("stroke-width", 1.5)
        .attr("class", (d) => {
          return `path-${d[1][1]}-cases`;
        })
        .attr(
          "d",
          d3
            .line()
            .x((d) => this.x(this.dateParser(d[0])))
            .y((d) => {
              return this.yGroupByMonthYearCountryAllCountries(
                d[2].newCasesSmoothedMillion + this.epsilon
              );
            })
            .curve(d3.curveLinear)
        );

      this.svg
        .append("path")
        .datum(this.groupByMonthYearSpecificCountryVaccinesCases)
        .attr("fill", "none")
        .attr("stroke", "#d1a4af")
        .attr("stroke-width", 1.5)
        .attr("class", (d) => {
          return `path-${d[1][1]}-vaccines`;
        })
        .attr(
          "d",
          d3
            .line()
            .x((d) => this.x(this.dateParser(d[0])))
            .y((d) => {
              return this.yGroupByMonthYearCountryAllCountries(
                d[2].newVaccinesSmoothedMillion + this.epsilon
              );
            })
            .curve(d3.curveLinear)
        );

      let totalLength = this.svg
        .select(`.path-${this.countryToAdd}-cases`)
        .node()
        .getTotalLength();

      this.svg.selectAll("path").attr("id", "not-active");

      this.svg.select(`.path-${this.countryToAdd}-cases`)
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .attr("id", "active-cases")
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      totalLength = this.svg
        .select(`.path-${this.countryToAdd}-vaccines`)
        .node()
        .getTotalLength();

      this.svg.select(`.path-${this.countryToAdd}-vaccines`)
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .attr("id", "active-vaccines")
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      this.drawYAxisSpecificCountry();

      this.drawVoronoi(this.groupVoronoiData);
    },

    drawYAxisSpecificCountry() {
      this.svg.select(".axis-y-specific").remove();

      this.svg
        .append("g")
        .attr("class", "axis-y-specific")
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
      this.svg.select(`.path-${this.countryToDelete}-cases`).remove();
      this.svg.select(`.path-${this.countryToDelete}-vaccines`).remove();
      this.deleteVoronoi();
      this.drawVoronoi(this.groupVoronoiData);

      if (!this.selectedCountries.length) {
        this.drawAllCountriesLine();
        this.drawYAxisAllCountries();
      }
    },
    deleteVoronoi() {
      this.svg.select(".voronoi").remove();
    },

    drawVoronoiAllCountries(data) {
      this.deleteVoronoi();

      let casesVaccinesArray = [];

      for (let i = 0; i < data.length; i++) {
        casesVaccinesArray.push({
          date: data[i][0],
          val: data[i][1].newCasesSmoothedMillion,
        });
        casesVaccinesArray.push({
          date: data[i][0],
          val:
            data[i][1].newVaccinesSmoothedMillion > 0
              ? data[i][1].newVaccinesSmoothedMillion
              : data[i][1].newVaccinesSmoothedMillion + this.epsilon,
        });
      }

      let points = casesVaccinesArray.map((d) => {
        return [this.x(this.dateParser(d.date)), this.y(d.val)];
      });

      let delaunay = d3.Delaunay.from(points);
      let voronoi = delaunay.voronoi([0, 0, this.innerWidth, this.innerHeight]);

      let voronoiGroup = this.svg.append("g").attr("class", "voronoi");

      points.map((point, i) => {
        return (
          voronoiGroup
            .append("path")
            // .attr("stroke", "pink")
            .on("mouseover", () =>
              this.onHoverVoronoiAllCountries(casesVaccinesArray[i])
            )
            .on("click", () =>
              this.mouseClick(this.groupByMonthYearAllCountriesVaccinesCases)
            )
            .attr(
              "d",

              voronoi.renderCell(i)
            )
        );
      });
    },

    onHoverVoronoiAllCountries(data) {
      this.svg.selectAll("path").attr("id", "not-active");
      d3.selectAll(".voronoi g").remove();

      let lineChartTooltip = this.svg
        .select(".voronoi")
        .append("g")
        .attr(
          "transform",
          `translate(${this.x(this.dateParser(data.date))},
          ${this.y(data.val)})`
        );

      lineChartTooltip.append("circle").attr("r", this.circleRadius);
      // .on("click", () =>
      //   this.mouseClick(this.groupByMonthYearAllCountriesVaccinesCases)
      // );

      lineChartTooltip
        .append("text")
        .text(`${data.date},${this.formatValue(data.val)} `);
    },

    drawVoronoi(data) {
      this.deleteVoronoi();

      let casesVaccinesArray = [];
      for (let i = 0; i < data.length; i++) {
        casesVaccinesArray.push({
          date: data[i][0],
          isoCode: data[i][1],
          countryName: data[i][2],
          val: data[i][3].newCasesSmoothedMillion,
        });
        casesVaccinesArray.push({
          date: data[i][0],
          isoCode: data[i][1],
          countryName: data[i][2],
          val:
            data[i][3].newVaccinesSmoothedMillion > 0
              ? data[i][3].newVaccinesSmoothedMillion
              : data[i][3].newVaccinesSmoothedMillion + this.epsilon,
        });
      }

      let points = casesVaccinesArray.map((d) => {
        return [
          this.x(this.dateParser(d.date)),
          this.yGroupByMonthYearCountryAllCountries(d.val + this.epsilon),
        ];
      });

      let delaunay = d3.Delaunay.from(points);
      let voronoi = delaunay.voronoi([0, 0, this.innerWidth, this.innerHeight]);

      let voronoiGroup = this.svg.append("g").attr("class", "voronoi");

      points.map((point, i) => {
        return voronoiGroup
          .append("path")
          .on("mouseover", () => this.onHoverVoronoi(casesVaccinesArray[i]))
          .on("click", () =>
            this.mouseClick(this.groupByMonthYearAllCountriesVaccinesCases)
          )
          .attr(
            "d",

            voronoi.renderCell(i)
          );
      });
    },

    onHoverVoronoi(data) {
      this.svg.selectAll("path").attr("id", "not-active");
      this.svg.selectAll(".voronoi g").remove();

      this.svg.select(`.path-${data.isoCode}-cases`).attr("id", "active-cases");
      this.svg.select(`.path-${data.isoCode}-vaccines`).attr("id", "active-vaccines");

      let lineChartTooltip = this.svg
        .select(".voronoi")
        .append("g")
        .attr(
          "transform",
          `translate(${this.x(this.dateParser(data.date))},
          ${this.yGroupByMonthYearCountryAllCountries(
            data.val > 0 ? data.val : data.val + this.epsilon
          )})`
        );

      //  lineChartTooltip.append("rect")
      // .attr("class", "tooltip-frame")
      // .attr("width", 150)
      // .attr("height", 50)

      lineChartTooltip.append("circle").attr("r", this.circleRadius);
      // .on("click", () =>
      //   this.mouseClick(this.groupByMonthYearAllCountriesVaccinesCases)
      // );

      lineChartTooltip
        .append("text")
        .text(
          `${data.date},${data.countryName},${this.formatValue(data.val)} `
        );
      // .attr("x", -70)
      //   .attr("y", 18);
    },

    mouseClick(data) {
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
        return this.$store.getters.lineChartData;
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

    groupByMonthYearAllCountriesVaccinesCases() {
      let valuesToSum = [
        "newCasesSmoothedMillion",
        "newVaccinesSmoothedMillion",
      ];

      return d3.flatRollup(
        this.data,
        (v) =>
          Object.fromEntries(
            valuesToSum.map((col) => [col, d3.sum(v, (d) => d[col])])
          ),
        (d) => d.monthYear
      );
    },

    groupByMonthYearSpecificCountryVaccinesCases() {
      let valuesToSum = [
        "newCasesSmoothedMillion",
        "newVaccinesSmoothedMillion",
      ];

      return d3.flatRollup(
        this.lineSpecificCountryData,
        (v) =>
          Object.fromEntries(
            valuesToSum.map((col) => [col, d3.sum(v, (d) => d[col])])
          ),
        (d) => d.monthYear,
        (d) => d.isoCode
      );
    },
    groupByMonthYearCountry() {
      let valuesToSum = [
        "newCasesSmoothedMillion",
        "newVaccinesSmoothedMillion",
      ];

      return d3.flatRollup(
        this.data,
        (v) =>
          Object.fromEntries(
            valuesToSum.map((col) => [col, d3.sum(v, (d) => d[col])])
          ),
        (d) => d.monthYear,
        (d) => d.isoCode
      );
    },
    groupVoronoiData(){
 let valuesToSum = [
        "newCasesSmoothedMillion",
        "newVaccinesSmoothedMillion",
      ];

     return d3.flatRollup(
        this.voronoiData,
        (v) =>
          Object.fromEntries(
            valuesToSum.map((col) => [col, d3.sum(v, (d) => d[col])])
          ),
        (d) => d.monthYear,
        (d) => d.isoCode,
        (d) => d.countryName
      );
    },

    x() {
      return d3
        .scaleTime()
        .domain(
          d3.extent(this.groupByMonthYearAllCountriesVaccinesCases, (d) =>
            this.dateParser(d[0])
          )
        )
        .range([0, this.innerWidth]);
    },

    y() {
      return d3
        .scaleLog()
        .domain([
          this.epsilon,
          d3.max(this.groupByMonthYearAllCountriesVaccinesCases, (d) =>
            d[1].newCasesSmoothedMillion > d[1].newVaccinesSmoothedMillion
              ? d[1].newCasesSmoothedMillion
              : d[1].newVaccinesSmoothedMillion
          ),
        ])
        .range([this.innerHeight, 0])
        .nice();
    },
    yGroupByMonthYearCountryAllCountries() {
      return d3
        .scaleLog()
        .domain([
          this.epsilon,
          d3.max(this.groupByMonthYearCountry, (d) =>
            d[2].newCasesSmoothedMillion > d[2].newVaccinesSmoothedMillion
              ? d[2].newCasesSmoothedMillion
              : d[2].newVaccinesSmoothedMillion
          ),
        ])
        .range([this.innerHeight, 0])
        .nice();
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
    selectedCountries: {
      handler() {
        if (this.selectedCountries.length === 0) this.drawAllCountriesLine();
      },
    },
    deep: true,
  },
};
</script>

<style>
.tooltip-frame {
  fill: white;
  stroke: #000;
}

#active-cases {
  stroke: #062f5c;
  stroke-width: 2.5;
}

#active-vaccines {
  stroke-width: 2.5;
  stroke: #9e0a2f;
}
#none {
  stroke: #000;
}

/* circle {
  cursor: pointer;
} */

.voronoi path {
  fill: none;
  pointer-events: all;
}
</style>
