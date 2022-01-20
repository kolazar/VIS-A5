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
    };
  },
  mounted() {
    this.drawAllCountriesLine();
    this.createTooltip();
  },
  methods: {
    drawAllCountriesLine() {
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
      //   this.data,
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
        .datum(this.groupByMonthYear)
        .attr("class", "all-countries")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x((d) => this.x(d3.timeParse("%m/%Y")(d[0])))
            .y((d) => this.y(d[1]))
            .curve(d3.curveNatural)
        );

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

    drawOneCountryLine() {

 d3.select(".all-countries").remove();

 
        let  groupByMonthYearSpecificCountry = this.groupByMonthYearSpecificCountry(this.lineSpecificCountryData)
          

          console.log("it works");
          console.log(groupByMonthYearSpecificCountry);
          this.svg
            .append("path")
            .datum( groupByMonthYearSpecificCountry)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr(
              "d",
              d3
                .line()
                .x((d) => this.x(d3.timeParse("%m/%Y")(d[0])))
                .y((d) => this.y(d[1]))
                .curve(d3.curveNatural)
            );
       
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
        .on("mousemove", () => this.mouseMove(this.groupByMonthYearArray))
        .on("click", () => this.mouseClick(this.groupByMonthYearArray));
    },
    mouseMove(data) {
      let formatValue = d3.format(",.0f");
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
      this.focus.select(".tooltip-info").text(formatValue(d.value));
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
      // this.$store.commit("changeSelectedDate", d.date);
      // this.$store.commit("changeSelectedYear", d.date.getFullYear());
    },

    groupByMonthYearSpecificCountry(data) {

  
        return d3.rollup(
          data,
          (v) =>
            d3.sum(v, (d) => {
              if (typeof d.newCasesSmoothedMillion !== "undefined")
                return d.newCasesSmoothedMillion;
            }),
          (d) => d.monthYear
        );
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
    

    groupByMonthYear() {
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
    groupByMonthYearArray() {
      return Array.from(this.groupByMonthYear, ([date, value]) => ({
        date,
        value,
      }));
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
          d3.extent(this.groupByMonthYearArray, (d) =>
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
        .domain([0, d3.max(this.groupByMonthYear, (d) => d[1])])
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
  },

  watch: {
    data: {
      handler() {
        this.drawAllCountriesLine();
      },
      deep: true,
    },
    selectedCountries: {
      handler() {
        this.drawOneCountryLine();
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
