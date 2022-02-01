<template>
  <div class="vis-component" ref="chart">
    <div class="tooltip"></div>
    <svg class="main-svg" :width="svgWidth" :height="svgHeight">
      <g class="chart-group" ref="chartGroup">
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
      radius: 7,
    };
  },
  mounted() {
    this.drawScatterPlot();
  },
  methods: {
    drawScatterPlot() {
      if (this.$refs.chart) this.svgWidth = this.$refs.chart.clientWidth;

      this.drawXAxis();
      this.drawYAxis();
      this.drawCircles();
    },
    drawXAxis() {
      d3.select(".scatterplot-x-axis").remove();
      this.svg
        .append("g")
        .attr(
          "transform",
          `translate( 0, ${
            this.svgHeight - this.svgPadding.top - this.svgPadding.bottom
          } )`
        )
        .attr("class", "scatterplot-x-axis")
        .call(d3.axisBottom(this.xScale))
        .raise()
        .append("text")
        .attr("y", 40)
        .attr(
          "x",
          (this.svgHeight - this.svgPadding.top - this.svgPadding.bottom) / 2
        )
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text("New deaths smoothed per million");
    },

    drawYAxis() {
      d3.select(".scatterplot-y-axis").remove();
      this.svg
        .append("g")
        .attr("class", "scatterplot-y-axis")
        .call(d3.axisLeft(this.yScale))
        .raise()
        .append("text")
        .attr("transform", "rotate(-90)")
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

      this.svg.selectAll("title").remove();
      this.svg.selectAll("circle").remove();

      let circlesGroup = this.svg.selectAll("circle").data(this.data);

      circlesGroup.exit().remove();

      circlesGroup
        .enter()
        .append("circle")
        .attr("class", (d) => `scatterplot scatter-` + d.isoCode)
        .attr("r", this.radius)
        .attr("stroke", (d) =>
          this.selectedCountries.includes(d.isoCode) ? "orange" : "#fff"
        )
        .attr("stroke-width", (d) =>
          this.selectedCountries.includes(d.isoCode) ? 2 : null
        )
        .merge(circlesGroup)

        .attr("cx", (d) => {
          return this.xScale(d.newDeathsSmoothedMillion);
        })

        .attr("cy", (d) => {
          return this.yScale(d.newVaccinesSmoothedMillion);
        })

        .attr("fill", "steelblue")
        .on("click", (event, d) => this.mouseClick(d))
        .append("title")
        .text((d) => {
          return `${d.countryName}, New deaths: ${this.formatValue(
            d.newDeathsSmoothedMillion
          )},New vaccinations:${this.formatValue(
            d.newVaccinesSmoothedMillion
          )}`;
        });

      // .on("mouseover", () => this.handleCircleMouseHover())
      // .on("mousemove", (event, d) =>
      //   this.handleCircleMouseMove(event, d.countryName)
      // )
      // .on("mouseleave", () => this.handleCircleMouseOut());
    },
    updateCircles() {
      // this.svg.selectAll("title").remove();
      //  this.svg.selectAll("circle").remove();

      let circlesGroup = this.svg.selectAll("circle").data(this.data1);

      circlesGroup.exit().remove();

      circlesGroup
        .enter()
        .append("circle")
        .attr("class", (d) => `scatterplot scatter-` + d.isoCode)
        .attr("r", this.radius)
        .attr("stroke", (d) =>
          this.selectedCountries.includes(d.isoCode) ? "orange" : "#fff"
        )
        .attr("stroke-width", (d) =>
          this.selectedCountries.includes(d.isoCode) ? 2 : null
        )
.attr("fill", "steelblue")

        .merge(circlesGroup)
        
        .transition()
        .duration(1000)
        .delay((d, i) => {
          return (i / this.data1.length) * 700;
        })
        .attr("cx", (d) => {
          return this.xScale1(d.newDeathsSmoothedMillion);
        })
        .attr("cy", (d) => {
          return this.yScale1(d.newVaccinesSmoothedMillion);
        })


circlesGroup
 .on("click", (event, d) => this.mouseClick(d))
        .append("title")
        .text((d) => {
          return `${d.countryName}, New deaths: ${this.formatValue(
            d.newDeathsSmoothedMillion
          )},New vaccinations:${this.formatValue(
            d.newVaccinesSmoothedMillion
          )}`;
        });


      d3.select(".scatterplot-x-axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(this.xScale1));

      d3.select(".scatterplot-y-axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(this.yScale1));
    },
    mouseClick(data) {
      if (!this.selectedCountries.includes(data.isoCode)) {
        this.$store.commit("addSelectedCountry", data.isoCode);
        d3.selectAll(`.${data.isoCode}`)
          .attr("stroke", "orange")
          .attr("stroke-width", 1.5);
        // d3.selectAll(`.scatterplot`)
        //   .attr('id','not-active-dot');
        d3.selectAll(`.scatter-${data.isoCode}`)
          .attr("stroke", "orange")
          .attr("stroke-width", 2);
        // .attr('id','active-dot');
      } else {
        this.$store.commit("deleteSelectedCountry", data.isoCode);

        d3.selectAll(`.${data.isoCode}`).attr("stroke", null);
        d3.selectAll(`.scatter-${data.isoCode}`).attr("stroke", null);
      }
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
    data: {
      get() {
        return this.$store.getters.scatterPlotData;
      },
    },
    data1: {
      get() {
        return this.$store.getters.scatterPlotData1;
      },
    },
    selectedDate: {
      get() {
        return this.$store.getters.selectedDate;
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

    svg() {
      return d3
        .select(this.$refs.chartGroup)
        .attr(
          "transform",
          `translate(${this.svgPadding.left},${this.svgPadding.top})`
        );
    },

    dataMaxDeaths() {
      return d3.max(this.data, (d) => d.newDeathsSmoothedMillion);
    },
    dataMinDeaths() {
      return d3.min(this.data, (d) => d.newDeathsSmoothedMillion);
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
      return d3.max(this.data, (d) => d.newVaccinesSmoothedMillion);
    },
    dataMinVaccines() {
      return d3.min(this.data, (d) => d.newVaccinesSmoothedMillion);
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

    dataMaxDeaths1() {
      return d3.max(this.data1, (d) => d.newDeathsSmoothedMillion);
    },
    dataMinDeaths1() {
      return d3.min(this.data1, (d) => d.newDeathsSmoothedMillion);
    },
    xScale1() {
      return d3
        .scaleLinear()
        .rangeRound([
          0,
          this.svgWidth - this.svgPadding.left - this.svgPadding.right,
        ])
        .domain([this.dataMinDeaths1, this.dataMaxDeaths1])
        .nice();
    },

    dataMaxVaccines1() {
      return d3.max(this.data1, (d) => d.newVaccinesSmoothedMillion);
    },
    dataMinVaccines1() {
      return d3.min(this.data1, (d) => d.newVaccinesSmoothedMillion);
    },
    yScale1() {
      return d3
        .scaleLinear()
        .rangeRound([
          this.svgHeight - this.svgPadding.top - this.svgPadding.bottom,
          0,
        ])
        .domain([this.dataMinVaccines1, this.dataMaxVaccines1])
        .nice();
    },

    formatValue() {
      return d3.format(",.1f");
    },
  },
  watch: {
    data: {
      handler() {
        this.drawScatterPlot();
      },

      deep: true,
    },

    selectedDate: {
      handler() {
        // this.drawScatterPlot();
        this.updateCircles();
      },

      deep: true,
    },
  },
};
</script>

<style >
.tooltip {
  opacity: 0;
  background-color: white;
  border-style: solid;
  border-width: 0.5px;
  border-radius: 3px;
  padding: 8px;
}

#active-dot {
  opacity: 1;
}
#not-active-dot {
  opacity: 0.1;
}

.scatterplot {
  opacity: 0.5;
}
</style>
