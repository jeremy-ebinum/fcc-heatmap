import { select } from "d3-selection";
import { json } from "d3-fetch";
import localApiData from "../data/data";

import "./app.scss";

const margins = { top: 48, right: 48, bottom: 128, left: 48 };
const svgW = 1072 - margins.left - margins.right;
const svgH = 614 - margins.top - margins.bottom;
const dataUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

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

const runApp = async () => {
  select(".js-d3").html("");

  const svgElem = select(".js-d3")
    .append("svg")
    .attr("width", svgW + margins.left + margins.right)
    .attr("height", svgH + margins.top + margins.bottom)
    .append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

  let dataset = await fetchData();
  if (!dataset) dataset = localApiData;
};

export default runApp;
