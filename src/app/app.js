import { select } from "d3-selection";
import { json } from "d3-fetch";
import { min, max } from "d3-array";
import { scaleBand, scaleSequential } from "d3-scale";
import { interpolateRdYlBu } from "d3-scale-chromatic";
import { axisBottom, axisLeft } from "d3-axis";
import { timeFormat } from "d3-time-format";
import localApiData from "../data/data";

import "./app.scss";

const margins = { top: 32, right: 48, bottom: 128, left: 160 };
const svgW = 1392 - margins.left - margins.right;
const svgH = 664 - margins.top - margins.bottom;
const dataUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let dataset;
let baseTemp;

const fetchData = async () => {
  let res = null;

  try {
    res = await json(dataUrl);
    return res;
  } catch (e) {
    console.error(e.message);
  }

  return res;
};

const createTooltip = () => {
  select(".js-wrapper")
    .append("div")
    .attr("class", "tooltip js-tooltip")
    .attr("id", "tooltip")
    .style("opacity", 0);
};

const handleMouseOver = function (d) {
  const pos = select(this).node().getBoundingClientRect();
  const date = timeFormat("%B, %Y")(new Date(d.year, d.month - 1));
  const temps = `${(baseTemp + d.variance).toFixed(3)}℃ (${
    d.variance < 0 ? "" : "+"
  }${d.variance}℃)`;

  select(this).style("stroke", "black").style("opacity", 1);

  select(".js-tooltip")
    .attr("data-year", d.year)
    .html(`${date} <br/> ${temps}`)
    .style("left", `${pos.x}px`)
    .style("top", `${window.pageYOffset + pos.y - 64}px`)
    .style("opacity", 0.9);
};

const handleMouseLeave = function () {
  select(".js-tooltip").style("opacity", 0);
  select(this).style("stroke", "none").style("opacity", 0.8);
};

const runApp = async () => {
  select(".js-d3").html("");

  const svgElem = select(".js-d3")
    .append("svg")
    .attr("width", svgW + margins.left + margins.right)
    .attr("height", svgH + margins.top + margins.bottom)
    .append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

  createTooltip();

  let data = await fetchData();
  if (!data) data = localApiData;

  baseTemp = data.baseTemperature;
  dataset = data.monthlyVariance;

  const years = dataset.map((d) => d.year);
  const months = dataset.map((d) => d.month);
  const tempVariances = dataset.map((d) => d.variance);
  const minTemp = baseTemp + min(tempVariances);
  const maxTemp = baseTemp + max(tempVariances);

  const colorScale = scaleSequential()
    .interpolator(interpolateRdYlBu)
    .domain([maxTemp, minTemp]);

  const xScale = scaleBand().domain(years).range([0, svgW]).padding(0.05);
  const xAxis = axisBottom(xScale).tickValues(
    xScale.domain().filter((year) => {
      return year % 10 === 0;
    })
  );

  // xAxisGroup
  svgElem
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${svgH})`);

  // xLabel
  svgElem
    .append("text")
    .attr("x", svgW / 2)
    .attr("y", svgH + 48)
    .attr("class", "x-label")
    .style("text-anchor", "middle")
    .text("Years");

  const yScale = scaleBand().domain(months).range([0, svgH]);
  const yAxis = axisLeft(yScale)
    .tickValues(yScale.domain())
    .tickFormat((month) => {
      return timeFormat("%B")(new Date(`1970-${month}-1`));
    });

  // yAxisGroup
  svgElem.append("g").call(yAxis).attr("id", "y-axis");

  // yLabel
  svgElem
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -180)
    .attr("y", -60)
    .attr("class", "y-label")
    .text("Months");

  svgElem
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => baseTemp + d.variance)
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.month))
    .attr("width", () => xScale.bandwidth())
    .attr("height", () => yScale.bandwidth())
    .style("fill", (d) => colorScale(baseTemp + d.variance))
    .on("mouseover", handleMouseOver)
    .on("mousemove", handleMouseOver)
    .on("mouseleave", handleMouseLeave);
};

export default runApp;
