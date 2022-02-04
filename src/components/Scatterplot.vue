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
      svgWidth: 500,
      svgHeight: 500,
      svgPadding: {
        top: 20,
        right: 50,
        bottom: 50,
        left: 50,
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
      d3.select(".scatterplot-axes").remove();
      d3.select(".scatterplot-x-axis").remove();

      this.svg.append("g").attr("class", "scatterplot-axes");

      this.svg
        .select(".scatterplot-axes")
        .append("g")
        .attr("transform", `translate( 0, ${this.innerHeight} )`)
        .attr("class", "scatterplot-x-axis")
        .call(
          d3
            .axisBottom(this.xScale)
            .tickSize(-this.innerHeight)
            .tickSizeOuter(6)
        )

        .append("text")
        .attr("class", "scatterplot-axes-text")
        .attr("y", 30)
        .attr("x", this.innerWidth / 2)
        .attr("text-anchor", "middle")
        .text("New deaths smoothed per million");
    },

    drawYAxis() {
      d3.select(".scatterplot-y-axis").remove();
      this.svg
        .select(".scatterplot-axes")
        .append("g")
        .attr("class", "scatterplot-y-axis")
        .call(
          d3.axisLeft(this.yScale).tickSize(-this.innerWidth).tickSizeOuter(6)
        )
        .append("text")
        .attr("class", "scatterplot-axes-text")
        .attr("transform", "rotate(-90)")
        .attr("x", -6)
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("New vaccines smoothed per million")
        .raise();
    },
    drawCircles() {
      this.svg.selectAll("title").remove();
      this.svg.selectAll("circle").remove();

      let circlesGroup = this.svg
        .select(".circles-group")
        .raise()
        .selectAll("circle")
        .data(this.data);

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
        .text((d) => this.createTooltipText(d));
    },
    updateCircles() {
      if (this.selectedCountries.length !== 0) {
        d3.selectAll(`.scatterplot`).attr("id", "not-active-dot");
      }

      let circlesGroup = this.svg
        .select(".circles-group")
        .selectAll("circle")
        .data(this.data1);

      circlesGroup.attr("class", (d) => `scatterplot scatter-` + d.isoCode);

      circlesGroup.exit().remove();

      circlesGroup
        .enter()
        .append("circle")
        .attr("cx", () => this.xScale1(0))
        .attr("cy", () => this.yScale1(0 + this.innerHeight / 2))
        .attr("class", (d) => `scatterplot scatter-` + d.isoCode)
        .attr("r", this.radius)

        .attr("fill", "steelblue")
        .attr("id", (d) =>
          !this.selectedCountries.includes(d.isoCode)
            ? "not-active-dot"
            : "active-dot"
        )
        .append("title")
        .text((d) => this.createTooltipText(d))
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
        });

      this.selectedCountries.forEach((element) => {
        d3.select(`.scatter-${element}`).attr("id", "active-dot");
      });

      circlesGroup.on("click", (event, d) => this.mouseClick(d));

      circlesGroup.select("title").text((d) => this.createTooltipText(d));

      d3.select(".scatterplot-x-axis")
        .transition()
        .duration(1000)
        .call(
          d3
            .axisBottom(this.xScale1)
            .tickSize(-this.innerHeight)
            .tickSizeOuter(6)
        );

      d3.select(".scatterplot-y-axis")
        .transition()
        .duration(1000)
        .call(
          d3.axisLeft(this.yScale1).tickSize(-this.innerWidth).tickSizeOuter(6)
        );
    },

    createTooltipText(d) {
      return `${d.countryName}, \nNew deaths: ${this.formatValue(
        d.newDeathsSmoothedMillion
      )},\nNew vaccinations: ${this.formatValue(d.newVaccinesSmoothedMillion)}`;
    },
    mouseClick(data) {
      if (!this.selectedCountries.includes(data.isoCode)) {
        this.$store.commit("addSelectedCountry", data.isoCode);
        d3.select(".map").selectAll("path").attr("id", "not-active-country");

        this.selectedCountries.forEach((element) => {
          d3.select(`.${element}`)
            .attr("id", "active-country")
            .attr("stroke", "orange")
            .attr("stroke-width", 1.5);
        });

        d3.selectAll(`.scatterplot`).attr("id", "not-active-dot");

        this.selectedCountries.forEach((element) => {
          d3.select(`.scatter-${element}`).attr("id", "active-dot");
        });
      } else {
        this.$store.commit("deleteSelectedCountry", data.isoCode);

        if (this.selectedCountries.length === 0) {
          d3.selectAll(`.scatterplot`).attr("id", null);
          d3.select(".map")
            .selectAll("path")
            .attr("id", null)
            .attr("stroke", null)
            .attr("stroke-width", null);
        } else {
          d3.selectAll(`.${data.isoCode}`)
            .attr("id", "not-active-country")
            .attr("stroke", null)
            .attr("stroke-width", null);
          d3.selectAll(`.scatter-${data.isoCode}`).attr("id", "not-active-dot");
        }
      }
    },
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
        .rangeRound([0, this.innerWidth])
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
        .rangeRound([this.innerHeight, 0])
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
        .rangeRound([0, this.innerWidth])
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
        .rangeRound([this.innerHeight, 0])
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
        this.updateCircles();
      },

      deep: true,
    },
  },
};
</script>

<style >
.scatterplot-axes text {
  fill: #635f5d;
}

.scatterplot-axes line {
  stroke: #e5e2e0;
}

.scatterplot-axes .scatterplot-axes-text {
  font-size: 14px;
}

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
  stroke: orange;

  stroke-width: 2;
}
#not-active-dot {
  opacity: 0.1;
}

.scatterplot {
  opacity: 0.5;
  cursor: pointer;
}
</style>
