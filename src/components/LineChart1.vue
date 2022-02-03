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
        right: 50,
        bottom: 50,
        left: 50,
      },
      circleRadius: 5,
      epsilon: 1,
      legendTextSpacing: 7,
    };
  },
  mounted() {
    this.drawAllCountriesLine();
  },
  methods: {
    drawAllCountriesLine() {
      if (this.$refs.chart) this.svgWidth = this.$refs.chart.clientWidth;

      this.svg.selectAll("path").remove();

      this.drawXAxis();
      this.drawYAxisAllCountries();
      this.drawVoronoiAllCountries(
        this.groupByMonthYearAllCountriesVaccinesCases
      );
      this.drawLegend();

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

      this.svg
        .select(`#cases`)

        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .attr("id", "active-cases")
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      totalLength = this.svg.select(`#vaccines`).node().getTotalLength();

      this.svg
        .select(`#vaccines`)

        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .attr("id", "active-vaccines")
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    },

    drawXAxis() {
      this.svg.select(".lines-axes").remove();
      this.svg.select(".line1-axis-x").remove();

      this.svg.append("g").attr("class", "lines-axes");

      this.svg
        .select(".lines-axes")
        .append("g")
        .attr("class", "line1-axis-x")
        .attr("transform", `translate(0,${this.innerHeight})`)
        .call(
          d3.axisBottom(this.x).tickSize(-this.innerHeight).tickSizeOuter(6)
        )
        .lower();
    },

    drawYAxisAllCountries() {
      this.svg.select(".line1-axis-y-all").remove();
      this.svg.select(".axis-y-specific").remove();

      this.svg
        .select(".lines-axes")
        .append("g")
        .attr("class", "line1-axis-y-all")
        .call(d3.axisLeft(this.y).tickSize(-this.innerWidth).tickSizeOuter(6))
        .lower()
        .append("text")
        .attr("class", "lines-axes-text")
        .attr("transform", "rotate(-90)")
        .attr("x", -6)
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("New Cases/Vaccines Smoothed per Million")
        .raise();
    },

    drawOneCountryLine() {
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

      this.svg
        .select(`.path-${this.countryToAdd}-cases`)
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

      this.svg
        .select(`.path-${this.countryToAdd}-vaccines`)
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
      this.svg
        .select(".line1-axis-y-all")

        .transition()
        .duration(1000)
        .call(
          d3
            .axisLeft(this.yGroupByMonthYearCountryAllCountries)
            .tickSize(-this.innerWidth)
            .tickSizeOuter(6)
        );
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
              this.onHoverVoronoiAllCountries(
                casesVaccinesArray[i],
                casesVaccinesArray[i + 1],
                casesVaccinesArray[i - 1]
              )
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

    onHoverVoronoiAllCountries(data, data1, data2) {
      this.svg.selectAll("path").attr("id", "not-active");
      d3.selectAll(".voronoi g").remove();

      this.createTooltip(data.date, data.val, undefined, true);

      let dataTooltip1;

      if (data2 !== undefined && data2.date === data.date) dataTooltip1 = data2;
      else dataTooltip1 = data1;

      this.createTooltip(dataTooltip1.date, dataTooltip1.val, undefined, true);
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
            data[i][3].newVaccinesSmoothedMillion >= 1
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
          .on("mouseover", () =>
            this.onHoverVoronoi(
              casesVaccinesArray[i],
              casesVaccinesArray[i + 1],
              casesVaccinesArray[i - 1]
            )
          )
          .on("click", () =>
            this.mouseClick(this.groupByMonthYearAllCountriesVaccinesCases)
          )
          .attr(
            "d",

            voronoi.renderCell(i)
          );
      });
    },

    onHoverVoronoi(data, data1, data2) {
      this.svg.selectAll("path").attr("id", "not-active");
      this.svg.selectAll(".voronoi g").remove();

      this.svg.select(`.path-${data.isoCode}-cases`).attr("id", "active-cases");
      this.svg
        .select(`.path-${data.isoCode}-vaccines`)
        .attr("id", "active-vaccines");

      this.createTooltip(data.date, data.val, data.countryName);

      let dataTooltip1;

      if (data2 !== undefined && data2.date === data.date) dataTooltip1 = data2;
      else dataTooltip1 = data1;

      this.createTooltip(
        dataTooltip1.date,
        dataTooltip1.val,
        dataTooltip1.countryName
      );
    },

    createTooltip(date, value, countryName, allCountries) {
      let lineChartTooltip = this.svg
        .select(".voronoi")
        .append("g")
        .attr(
          "transform",
          `translate(${this.x(this.dateParser(date))},
          ${
            !allCountries
              ? this.yGroupByMonthYearCountryAllCountries(
                  value >= 1 ? value : value + this.epsilon
                )
              : this.y(value >= 1 ? value : value + this.epsilon)
          })`
        );

      lineChartTooltip.append("circle").attr("r", this.circleRadius);

      if (countryName !== undefined) countryName = countryName + ", ";
      else countryName = "";

      this.createTooltipText(
        lineChartTooltip,
        "tooltip-text tooltip-text-stroke",
        date,
        countryName,
        value
      );
      this.createTooltipText(
        lineChartTooltip,
        "tooltip-text",
        date,
        countryName,
        value
      );

    },
    createTooltipText(tooltip, className, date, countryName, value) {
      tooltip
        .append("text")
        .attr("class", className)
        .attr("x", -10)
        .attr("y", -10)
        .text(
          `${this.timeFormat(this.dateParser(date))},${countryName}` +
            `Total: ` +
            `${this.formatValue(value)} `
        )
        .raise();

        
      if (+date.split("/")[0] < 4 && +date.split("/")[1] === 2020)
        tooltip
          .selectAll(".tooltip-text")
          .attr("id", "tooltip-text-start");

      if (+date.split("/")[0] > 8 && +date.split("/")[1] === 2021)
        tooltip
          .selectAll(".tooltip-text")
          .attr("id", "tooltip-text-end");
    },

    drawLegend() {
      this.svg.select(".line1-legend").remove();

      let legendGroup = this.svg.append("g").attr("class", "line1-legend");

      let legendGroupCases = legendGroup.append("g");

      legendGroupCases
        .append("circle")
        .attr("cx", this.innerWidth - 20)
        .attr("cy", this.innerHeight - 100)
        .attr("r", 7)
        .attr("fill", "#062f5c");

      legendGroupCases
        .append("text")
        .attr("x", this.innerWidth - this.legendTextSpacing)
        .attr("y", this.innerHeight - 100)
        .attr("dy", ".32em")
        .text("Cases");

      let legendGroupVaccines = legendGroup.append("g");
      legendGroupVaccines
        .append("circle")
        .attr("cx", this.innerWidth - 20)
        .attr("cy", this.innerHeight - 70)
        .attr("r", 7)
        .attr("fill", "#9e0a2f");

      legendGroupVaccines
        .append("text")
        .attr("x", this.innerWidth - this.legendTextSpacing)
        .attr("y", this.innerHeight - 70)
        .attr("dy", ".32em")
        .text("Vaccines");
    },

    mouseClick(data) {
      let x0 = this.x.invert(d3.pointer(event)[0]),
        bisectDate = d3.bisector((d) => this.dateParser(d[0])).left,
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - this.dateParser(d0[0]) > this.dateParser(d1[0]) - x0 ? d1 : d0;

      this.$store.commit("changeSelectedDate", d[0]);

      if (this.selectedCountries.length !== 0)
        d3.selectAll(`.scatterplot`).attr("id", "not-active-dot");
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
    groupVoronoiData() {
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
    timeFormat() {
      return d3.timeFormat("%B %Y");
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

.line1-legend circle {
  cursor: pointer;
}

.voronoi path {
  fill: none;
  pointer-events: all;
  cursor: pointer;
}

.line1-legend text {
  vertical-align: baseline;
  font-size: 14px;
  fill: #635f5d;
}
</style>
