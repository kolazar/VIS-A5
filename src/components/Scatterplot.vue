<template>
  <div class="vis-component" ref="chart">
      <div class="tooltip"></div>
      <svg class="main-svg" :width="svgWidth" :height="svgHeight">
        <g class="chart-group" ref="chartGroup">
          <g class="axis axis-x" ref="axisX"></g>
          <g class="axis axis-y" ref="axisY"></g>
          <g class="circles-group" ref="circles"></g>
        </g>
      </svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "Scatterplot",
  props: {},
  data() {
    return {
      n: 3,
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
    this.drawScatterPlot();
  },
  methods: {
    drawScatterPlot() {
      if (this.$refs.chart) this.svgWidth = this.$refs.chart.clientWidth;
      d3.select(this.$refs.chartGroup).attr(
        "transform",
        `translate(${this.svgPadding.left},${this.svgPadding.top})`
      );
      this.drawXAxis();
      this.drawYAxis();
      this.drawCircles();
    },
    drawXAxis() {
      d3.select(".xaxis").remove();
      d3.select(this.$refs.axisX)
        .attr(
          "transform",
          `translate( 0, ${
            this.svgHeight - this.svgPadding.top - this.svgPadding.bottom
          } )`
        )
        .call(d3.axisBottom(this.xScale))
        .raise()
        .append("text")
        .attr("class", "xaxis")
        .attr("y", 40)
        .attr("x", this.svgWidth / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text("New deaths smoothed per million");
    },
    drawYAxis() {
      d3.select(".yaxis").remove();
      d3.select(this.$refs.axisY)
        .call(d3.axisLeft(this.yScale))
        .raise()
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("class", "yaxis")
        .attr("x", -6)
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .text("New vaccines smoothed per million");
    },
    drawCircles() {
      // let brush = d3
      //   .brush()
      //   .extent([
      //     [0, 0],
      //     [
      //       this.svgWidth - this.svgPadding.left - this.svgPadding.right,
      //       this.svgHeight - this.svgPadding.top - this.svgPadding.bottom,
      //     ],
      //   ])
      //   .on("start brush", (event) => {
      //     return this.brush(event);
      //   });

      // d3.select(this.$refs.brush).call(brush);

      // let sumstat = d3.group(this.data, (d) => d.isoCode);

console.log(this.data);

      let circlesGroup = d3
        .select(this.$refs.circles)
        .selectAll("circle")
        .data(this.data);

      circlesGroup.exit().remove();

      circlesGroup
        .enter()
        .append("circle")
        .attr("class", (d) => d.isoCode)
        .attr("r", 4)
        .style("stroke", "#fff")
        .merge(circlesGroup)
        .attr("cx", (d) => {
          return this.xScale(d.newDeaths);
        })
        .attr("cy", (d) => this.yScale(d.newVaccinations))
        .style("opacity", "0.5")
        .attr("fill", "gray")
        .append("title")
        .text((d) => {
          return `${d.countryName}, New deaths: ${d.newDeaths},New vaccinations:${d.newVaccinations}`;
        })
        // .on("mouseover", () => this.handleCircleMouseHover())
        // .on("mousemove", (event, d) =>
        //   this.handleCircleMouseMove(event, d.countryName)
        // )
        // .on("mouseleave", () => this.handleCircleMouseOut());
    },
    // handleCircleMouseHover() {
    //   return d3.select(".tooltip").style("opacity", 1);
    // },
    // handleCircleMouseMove(event, d) {
    //   const [xm, ym] = d3.pointer(event);
    //   return d3
    //     .select(".tooltip")
    //     .html(d)
    //     .style("left", xm - 40 + "px")
    //     .style("top", ym + "px");
    // },
    // handleCircleMouseOut() {
    //   return d3
    //     .select(".tooltip")
    //     .transition()
    //     .duration(250)
    //     .style("opacity", 0);
    // },
  },
  computed: {
    selectedYear: {
      get() {
        return this.$store.getters.selectedYear;
      },
    },
    data: {
      get() {
        return this.$store.getters.newDeathsVaccines;
      },
    },
    dataMaxDeaths() {
      return d3.max(this.data, (d) => d.newDeaths);
    },
    dataMinDeaths() {
      return d3.min(this.data, (d) => d.newDeaths);
    },
    xScale() {
      return d3
        .scaleLinear()
        .rangeRound([
          0,
          this.svgWidth - this.svgPadding.left - this.svgPadding.right,
        ])
        .domain([this.dataMinDeaths, this.dataMaxDeaths])
        .nice();
    },

    dataMaxVaccines() {
      return d3.max(this.data, (d) => d.newVaccinations);
    },
    dataMinVaccines() {
      return d3.min(this.data, (d) => d.newVaccinations);
    },
    yScale() {
      return d3
        .scaleLinear()
        .rangeRound([
          this.svgHeight - this.svgPadding.top - this.svgPadding.bottom,
          0,
        ])
        .domain([this.dataMinVaccines, this.dataMaxVaccines])
        .nice();
    },
  },
  watch: {
    data: {
      handler() {
        this.drawScatterPlot();
      },

      deep: true,
    },
  },
};
</script>

<style>
.tooltip {
  opacity: 0;
  background-color: white;
  border-style: solid;
  border-width: 0.5px;
  border-radius: 3px;
  padding: 8px;
}
</style>
