function _1(md){return(
md`# HW2 Medium baseline (4pt)`
)}

function _data(FileAttachment){return(
FileAttachment("data.json").json()
)}

function _birthYearStatistic(createBirthStatistic){return(
createBirthStatistic()
)}

function _years(data){return(
data.map(item => item.Year)
)}

function _createBirthStatistic(years,data){return(
function createBirthStatistic(){
  var array = [];
  array.length = 0;
  var minYear = Math.min(...years);
  var maxYear = Math.max(...years);
  for (var y = minYear; y <= maxYear; y++) {
    array.push(
      {year:y, gender:"male", count:0}, 
      {year:y, gender:"female", count:0}
    );
  }
  data.forEach(x => {
    var categoryIndex = (x.Year-minYear)*2 + (x.Gender == "男" ? 0 : 1);
    array[categoryIndex].count++;
  });
  return array;
}
)}

function _6(Plot,birthYearStatistic){return(
Plot.plot({
  grid: true,
  y: {label: "count"},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(birthYearStatistic, {x: "year", y: "count"}),
  ]
})
)}

function _adjustmentPlot(Inputs){return(
Inputs.form({
	mt:  Inputs.range([0, 100], {label: "marginTop", step: 1}),
	mr:  Inputs.range([0, 100], {label: "marginRight", step: 1}),
	mb:  Inputs.range([0, 100], {label: "marginBottom", step: 1}),
	ml:  Inputs.range([0, 100], {label: "marginLeft", step: 1}),
})
)}

function _8(Plot,adjustmentPlot,birthYearStatistic){return(
Plot.plot({
  marginTop: adjustmentPlot.mt,
  marginRight: adjustmentPlot.mr,
  marginBottom: adjustmentPlot.mb,
  marginLeft: adjustmentPlot.ml,
  
  grid: true,
  y: {label: "count"},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(birthYearStatistic, {x: "year", y: "count", tip: true , fill:"gender"}),
  ]
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.json", {url: new URL("../data.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("birthYearStatistic")).define("birthYearStatistic", ["createBirthStatistic"], _birthYearStatistic);
  main.variable(observer("years")).define("years", ["data"], _years);
  main.variable(observer("createBirthStatistic")).define("createBirthStatistic", ["years","data"], _createBirthStatistic);
  main.variable(observer()).define(["Plot","birthYearStatistic"], _6);
  main.variable(observer("viewof adjustmentPlot")).define("viewof adjustmentPlot", ["Inputs"], _adjustmentPlot);
  main.variable(observer("adjustmentPlot")).define("adjustmentPlot", ["Generators", "viewof adjustmentPlot"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","adjustmentPlot","birthYearStatistic"], _8);
  return main;
}
