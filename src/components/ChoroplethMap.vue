<template>
  <div class="vis-component" ref="chart">
    <svg class="main-svg" :width="svgWidth" :height="svgHeight">
      <g class="chart-group" ref="chartGroup">
        <rect
          class="zoom"
          cursor="move"
          :x="this.innerWidth / 4"
          :width="this.innerWidth / 2"
          :height="this.innerHeight"
        ></rect>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import mapWorld from "@/assets/world.json";

export default {
  name: "ChoroplethMap",
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

      n: 3,
      k: 20,
      labels: ["low", "medium", "high"],
    };
  },
  mounted() {
    this.drawMap();
  },
  methods: {
    drawMap() {
      if (this.$refs.chart) this.svgWidth = this.$refs.chart.clientWidth;

      this.svg.selectAll(".title-country").remove();
      this.svg.select(".map").remove();

      let projection = d3
        .geoNaturalEarth1()
        .fitSize([this.svgWidth, this.svgHeight], mapWorld)
        .rotate([0, 0])
        .center([0, 20])
        .translate([this.innerWidth / 2, this.innerHeight / 2]);

      let path = d3.geoPath().projection(projection);

      let data = this.data;

      this.svg
        .append("g")
        .attr("class", "map")
        .selectAll("path")
        .data(mapWorld.features)
        .join("path")
        .attr("d", path)
        .attr("class", (d) => d.id)
        .attr("cursor", "pointer")
        .attr("fill", (d) => {
          if (data.get(d.id) !== undefined)
            return this.color([
              data.get(d.id).cardiovascDeathRate,
              data.get(d.id).diabetesPrevalence,
            ]);
        })
        .on("click", (event, d) => this.handleStateClick(d.id))
        .append("title")
        .attr("class", "title-country")
        .text((d) => this.createTooltipText(d, data))
        .raise();

      this.drawLegend();

      this.initializeZoom();
    },
    handleStateClick(data) {
      if (!this.selectedCountries.includes(data)) {
        this.$store.commit("addSelectedCountry", data);

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
        this.$store.commit("deleteSelectedCountry", data);

        if (this.selectedCountries.length === 0) {
          d3.selectAll(`.scatterplot`).attr("id", null);
          d3.select(".map")
            .selectAll("path")
            .attr("id", null)
            .attr("stroke", null)
            .attr("stroke-width", null);
        } else {
          d3.selectAll(`.${data}`)
            .attr("id", "not-active-country")
            .attr("stroke", null)
            .attr("stroke-width", null);
          d3.selectAll(`.scatter-${data}`).attr("id", "not-active-dot");
        }
      }
    },

    initializeZoom() {
      this.svg.call(
        d3
          .zoom()
          .scaleExtent([1, 8])
          .on("zoom", (event) => this.svg.attr("transform", event.transform))
      );

      d3.select(".zoom").call(
        d3
          .zoom()
          .scaleExtent([1, 8])
          .on("zoom", (event) => this.svg.attr("transform", event.transform))
      );
    },

    drawLegend() {
      this.svg.select(".legend").remove();

      let legend = d3
        .select(this.$refs.chartGroup)
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${this.innerWidth / 4},400)`)

        .append("g")
        .attr(
          "transform",
          `translate(-${(this.k * this.n) / 2},-${
            (this.k * this.n) / 2
          }) rotate(-45 ${(this.k * this.n) / 2},${(this.k * this.n) / 2})`
        );
      legend
        .append("marker")
        .attr("id", "triangle")
        .attr("markerHeight", 10)
        .attr("markerWidth", 10)
        .attr("refX", 6)
        .attr("refY", 3)
        .attr("orient", "auto")
        .append("path")
        .attr("class", "marker-path")
        .attr("d", "M0,0L9,3L0,6Z");

      legend
        .selectAll("rect")
        .data(this.rectangularProps)
        .enter()
        .append("rect")
        .attr("x", (d) => d.x)
        .attr("width", (d) => d.width)
        .attr("y", (d) => d.y)
        .attr("height", (d) => d.height)
        .attr("fill", (d) => d.fill)
        .on("mouseover", (event, d) => this.handleLegendMouseOver(d))
        .on("mouseout", () => this.handleLegendMouseOut())
        .append("title")
        .text((d) => d.label);

      legend
        .append("line")
        .attr("marker-end", "url(#triangle)")
        .attr("x1", 0)
        .attr("x2", this.n * this.k)
        .attr("y1", this.n * this.k)
        .attr("y2", this.n * this.k)
        .attr("stroke", "black")
        .attr("stroke-width", 1.5);

      legend
        .append("line")
        .attr("marker-end", "url(#triangle)")
        .attr("y1", this.n * this.k)
        .attr("y2", 0)
        .attr("stroke", "black")
        .attr("stroke-width", 1.5);

      legend
        .append("text")
        .attr("font-weight", "bold")
        .attr("dy", "0.71em")
        .attr("transform", `rotate(90) translate(${(this.n / 2) * this.k},6)`)
        .attr("text-anchor", "middle")
        .text("Cardio");

      legend
        .append("text")
        .attr("font-weight", "bold")
        .attr("dy", "0.71em")
        .attr(
          "transform",
          `translate(${(this.n / 2) * this.k},${this.n * this.k + 6})`
        )
        .attr("text-anchor", "middle")
        .text("Diabetes");
    },

    handleLegendMouseOver(data) {
      d3.select(".map").selectAll("path").attr("id", "not-active-country");

      this.svg
        .selectAll("path")
        .filter(function () {
          return d3.select(this).attr("fill") == data.fill;
        })
        .attr("id", "active-country");
    },
    handleLegendMouseOut() {
      if (this.selectedCountries.length === 0)
        d3.select(".map").selectAll("path").attr("id", "active-country");
      else d3.select(".map").selectAll("path").attr("id", "not-active-country");

      this.selectedCountries.forEach((element) => {
        d3.select(`.${element}`)
          .attr("id", "active-country")
          .attr("stroke", "orange")
          .attr("stroke-width", 1.5);
      });
    },

    createTooltipText(d, data) {
      if (data.get(d.id) !== undefined)
        return `${
          data.get(d.id).countryName
        },\nCardiovascular death rate: ${this.formatValue(
          data.get(d.id).cardiovascDeathRate
        )},\nDiabetes prevalence: ${data.get(d.id).diabetesPrevalence}`;
    },
  },
  computed: {
    data: {
      get() {
        return this.$store.getters.choroplethMapData;
      },
    },
    selectedCountries: {
      get() {
        return this.$store.getters.selectedCountries;
      },
    },

    svg() {
      return d3
        .select(this.$refs.chartGroup)
        .attr(
          "transform",
          `translate(${this.svgPadding.left} ,${this.svgPadding.top})`
        );
    },

    innerHeight() {
      return this.svgHeight - this.svgPadding.top - this.svgPadding.bottom;
    },
    innerWidth() {
      return this.svgWidth - this.svgPadding.left - this.svgPadding.right;
    },
    x() {
      return d3.scaleQuantile(
        Array.from(this.data.values(), (d) => d.cardiovascDeathRate),
        d3.range(this.n)
      );
    },

    y() {
      return d3.scaleQuantile(
        Array.from(this.data.values(), (d) => d.diabetesPrevalence),
        d3.range(this.n)
      );
    },
    rectangularProps() {
      let rectData = [];
      let plotAreaWidth = 60;
      let plotAreaHeight = 60;

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
          label: `Cardio: ${
            this.labels[j] && `(${this.labels[j]})`
          }\nDiabetes: ${this.labels[i] && `(${this.labels[i]})`}`,
        });
      });
      return rectData;
    },
    color() {
      return (value) => {
        if (!value) return "#001";
        let [a, b] = value;

        return this.colors[this.y(b) + this.x(a) * this.n];
      };
    },
    formatValue() {
      return d3.format(",.0f");
    },
  },

  watch: {
    data: {
      handler() {
        this.drawMap();
      },
      deep: true,
    },
  },
};
</script>

<style >
.zoom {
  fill: none;
  pointer-events: all;
}
.legend {
  font-family: sans-serif;
  font-size: 10px;
}

#active-country {
  opacity: 1;
}
#not-active-country {
  opacity: 0.1;
}
</style>
