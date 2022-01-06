<template>
  <div class="vis-component" ref="chart">
    <div class="placeholder">
      <!-- <b>Here comes the scatterplot</b>.
      <p>
        Education Attainment Rate for the Selected Year: {{ educationRates }}
      </p> -->
      <div class="tooltip"></div>
      <svg class="main-svg" :width="svgWidth" :height="svgHeight">
        <g class="chart-group" ref="chartGroup">
          <g class="axis axis-x" ref="axisX"></g>
          <g class="axis axis-y" ref="axisY"></g>
          <g class="rects-group" ref="rects"></g>
          <g class="brush" ref="brush"></g>
          <g class="circles-group" ref="circles"></g>
        </g>
      </svg>
    </div>
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
      this.drawRects();
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
        .call(d3.axisBottom(this.xScale).tickFormat((d) => d + "%"))
        .raise()
        .append("text")
        .attr("class", "xaxis")
        .attr("y", 40)
        .attr("x", this.svgWidth / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text("Educational Attainment: Bachelor's Degree or Higher");
    },
    drawYAxis() {
      d3.select(".yaxis").remove();
      d3.select(this.$refs.axisY)
        .call(d3.axisLeft(this.yScale).tickFormat(d3.format("$.2s")))
        .raise()
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("class", "yaxis")
        .attr("x", -6)
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .text("Average Personal Yearly Income");
    },
    drawRects() {
      let rectGroup = d3.select(this.$refs.rects);

      rectGroup
        .selectAll("rect")
        .data(this.rectangularProps)
        .enter()
        .append("rect")
        .attr("x", (d) => d.x)
        .attr("width", (d) => d.width)
        .attr("y", (d) => d.y)
        .attr("height", (d) => d.height)
        .attr("fill", (d) => d.fill);
    },

    drawCircles() {
      let brush = d3
        .brush()
        .extent([
          [0, 0],
          [
            this.svgWidth - this.svgPadding.left - this.svgPadding.right,
            this.svgHeight - this.svgPadding.top - this.svgPadding.bottom,
          ],
        ])
        .on("start brush", (event) => {
          return this.brush(event);
        });

      d3.select(this.$refs.brush).call(brush);

      let circlesGroup = d3
        .select(this.$refs.circles)
        .selectAll("circle")
        .data(this.combinedData);

      circlesGroup.exit().remove();

      circlesGroup
        .enter()
        .append("circle")
        .attr("class", (d) => d.state)
        .attr("r", 4)
        .style("stroke", "#fff")
        .merge(circlesGroup)
        .attr("cx", (d) => {
          return this.xScale(d.educationRate);
        })
        .attr("cy", (d) => this.yScale(d.personalIncome))
        .attr("fill", (d) => {
          return this.getColor(
            this.xScale(d.educationRate),
            this.yScale(d.personalIncome)
          );
        })
        .on("mouseover", () => this.handleCircleMouseHover())
        .on("mousemove", (event, d) =>
          this.handleCircleMouseMove(event, d.state)
        )
        .on("mouseleave", () => this.handleCircleMouseOut())
        .style("opacity", function (d) {
          return d.filtered ? 0.5 : 1;
        })
        .style("stroke-width", function (d) {
          return d.filtered ? 1 : 2;
        });
    },

    handleCircleMouseHover() {
      return d3.select(".tooltip").style("opacity", 1);
    },
    handleCircleMouseMove(event, d) {
      const [xm, ym] = d3.pointer(event);
      return d3
        .select(".tooltip")
        .html(d)
        .style("left", xm - 40 + "px")
        .style("top", ym + "px");
    },
    handleCircleMouseOut() {
      return d3
        .select(".tooltip")
        .transition()
        .duration(250)
        .style("opacity", 0);
    },
    brush({ selection }) {
      let x0 = this.xScale.invert(selection[0][0]);
      let x1 = this.xScale.invert(selection[1][0]);
      let y0 = this.yScale.invert(selection[1][1]);
      let y1 = this.yScale.invert(selection[0][1]);

      this.onBrush(x0, x1, y0, y1);
    },

    onBrush(x0, x1, y0, y1) {
      let clear = x0 === x1 || y0 === y1;
      let filtered = {
        value: false,
        state: "",
      };
      this.combinedData.forEach((d) => {
        filtered.value = clear
          ? false
          : d.educationRate < x0 ||
            d.educationRate > x1 ||
            d.personalIncome < y0 ||
            d.personalIncome > y1;

        filtered.state = d.state;

        this.$store.commit("changeFiltered", filtered);
      });
    },
    resetBrush() {
      let brush = d3.brush();
      d3.select(this.$refs.brush).call(brush.move, null);
    },
    getColor(x, y) {
      let rectData = this.rectangularProps;
      let color = "";
      rectData.forEach((element) => {
        if (
          x >= element.x &&
          x <= element.x1 &&
          y <= element.y1 &&
          y >= element.y
        )
          color = element.fill;
      });

      return color;
    },
  },
  computed: {
    selectedYear: {
      get() {
        return this.$store.getters.selectedYear;
      },
    },
    educationRates: {
      get() {
        return this.$store.getters.educationRates;
      },
    },
    dataMaxEd() {
      return d3.max(this.educationRates, (d) => d.value);
    },
    dataMinEd() {
      return d3.min(this.educationRates, (d) => d.value);
    },
    xScale() {
      return d3
        .scaleLinear()
        .rangeRound([
          0,
          this.svgWidth - this.svgPadding.left - this.svgPadding.right,
        ])
        .domain([this.dataMinEd - 1, this.dataMaxEd + 1]);
    },
    personalIncome: {
      get() {
        return this.$store.getters.personalIncome;
      },
    },
    dataMaxInc() {
      return d3.max(this.personalIncome, (d) => d.value);
    },
    dataMinInc() {
      return d3.min(this.personalIncome, (d) => d.value);
    },
    yScale() {
      return d3
        .scaleLinear()
        .rangeRound([
          this.svgHeight - this.svgPadding.top - this.svgPadding.bottom,
          0,
        ])
        .domain([this.dataMinInc - 2000, this.dataMaxInc + 1000]);
    },
    combinedData: {
      get() {
        return this.$store.getters.combinedData;
      },
    },

    rectangularProps() {
      let rectData = [];
      let plotAreaWidth =
        this.svgWidth - this.svgPadding.left - this.svgPadding.right;
      let plotAreaHeight =
        this.svgHeight - this.svgPadding.top - this.svgPadding.bottom;

      //Calculating properties for the rectangles
      d3.cross(d3.range(this.n), d3.range(this.n)).map(([i, j]) => {
        rectData.push({
          width: plotAreaWidth / 3,
          height: plotAreaHeight / 3,
          x: i * (plotAreaWidth / 3),
          y: (this.n - 1 - j) * (plotAreaHeight / 3),
          x1: i * (plotAreaWidth / 3) + plotAreaWidth / 3,
          y1: (this.n - 1 - j) * (plotAreaHeight / 3) + plotAreaHeight / 3,
          fill: this.colors[j * this.n + i],
        });
      });
      return rectData;
    },
  },
  watch: {
    combinedData: {
      handler() {
        this.drawScatterPlot();
      },

      deep: true,
    },
    selectedYear: {
      handler() {
        this.resetBrush();
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
