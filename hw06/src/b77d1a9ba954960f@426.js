function _1(md){return(
md`# HW06 Stacked Bar Chart`
)}

function _2(md){return(
md`## Simple baseline`
)}

function _roleSelection(selectionView){return(
selectionView()
)}

function _4(Plot,artistColumn,uniqueAnswer,artistRole,publicRole,data,roleSelection){return(
Plot.plot({
  title: artistColumn,
  height: 500,
  x: {
    label: "級距",
    domain: uniqueAnswer
  },
  y: {
    label: "數量",
    grid: true 
  },
  color: {
    domain: [artistRole, publicRole],
    range: ["#FF7575", "#D0D0D0"],
    legend: true
  },
  marks: [
    Plot.barY(data.filter(d => roleSelection.includes(d.role)), {
      x: "answer",
      y: "count",
      fill: "role",
      title: d => `有 ${d.count} 位${d.role}\n認為級距是${d.answer}`
    }),
  ]
})
)}

function _5(md){return(
md`## Medium baseline`
)}

function _roleSelection1(selectionView){return(
selectionView()
)}

function _chart1(svgStackBarChart,roleSelection1){return(
svgStackBarChart({
  selection: roleSelection1,
  duration: 0,
  shadow: false
})
)}

function _roleSelection2(selectionView){return(
selectionView()
)}

function _chart2(svgStackBarChart,roleSelection2){return(
svgStackBarChart({
  selection: roleSelection2,
  duration: 500,
  shadow: false
})
)}

function _10(md){return(
md`## Strong baseline`
)}

function _roleSelection3(selectionView){return(
selectionView()
)}

function _chart3(svgStackBarChart,roleSelection3){return(
svgStackBarChart({
  selection: roleSelection3,
  duration: 500,
  shadow: true
})
)}

function _publicQuestionnaire(FileAttachment){return(
FileAttachment("artistPublic.csv").csv()
)}

function _artistQuestionnaire(FileAttachment){return(
FileAttachment("artistVer.csv").csv()
)}

function _artistRole(){return(
"藝術工作者"
)}

function _publicRole(){return(
"一般民眾"
)}

function _publicColumn(publicQuestionnaire){return(
publicQuestionnaire.columns[4]
)}

function _artistColumn(artistQuestionnaire){return(
artistQuestionnaire.columns[3]
)}

function _publicAnswer(publicQuestionnaire,publicColumn){return(
publicQuestionnaire.map(data => data[publicColumn])
)}

function _artistAnswer(artistQuestionnaire,artistColumn){return(
artistQuestionnaire.map(data => data[artistColumn])
)}

function _uniqueAnswer(publicAnswer,artistAnswer){return(
[...new Set([...publicAnswer, ...artistAnswer])].sort()
)}

function _data(uniqueAnswer,artistAnswer,artistRole,publicAnswer,publicRole)
{
  var answerData = new Array();
  uniqueAnswer.forEach(value => {
    answerData.push({
      answer:value.toString(), 
      count:artistAnswer.filter(answer => answer == value).length, 
      role:artistRole
    });
    answerData.push({
      answer:value.toString(), 
      count:publicAnswer.filter(answer => answer == value).length, 
      role:publicRole
    });
  });
  return answerData;
}


function _selectionView(Inputs,artistRole,publicRole){return(
function selectionView() {
  return Inputs.checkbox([artistRole, publicRole], {label: "選擇資料集", value: [artistRole, publicRole]});
}
)}

function _svgStackBarChart(data,d3,artistRole,publicRole){return(
function svgStackBarChart(options) {
  // 定義邊界大小，以及圖形的寬度和高度
  const margin = {top: 20, right: 30, bottom: 30, left: 40};
  const width = 650 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  
  // 根據選擇的系列過濾數據
  const filteredData = data.filter(d => options.selection.includes(d.role));

  // 對過濾後的數據進行分組處理
  let grouped = Array.from(d3.group(filteredData, d => d.answer), ([key, value]) => {
    return {value: key, ...Object.fromEntries(value.map(obj => [obj.role, obj.count]))};
  });

  // 定義堆疊方式並計算
  const stack = d3.stack().keys([artistRole, publicRole]);
  const role = stack(grouped);
  
  // 定義x軸的比例尺
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.answer))
    .range([0, width])
    .padding(0.1);

  // 定義y軸的比例尺
  const yMax = d3.max(role, serie => d3.max(serie, d => d[1]));
  const yScale = d3.scaleLinear()
      .domain([0, yMax]).nice()
      .range([height, 0]);

  // 定義顏色的比例尺
  const colorScale = d3.scaleOrdinal()
    .domain([artistRole, publicRole])
    .range(["#FF7575", "#D0D0D0"]);

  // 創建SVG元素
  const svg = d3.create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // 定義陰影效果
  const defs = svg.append("defs");
  defs.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "130%")
    .append("feDropShadow")
    .attr("dx", 4)
    .attr("dy", 4)
    .attr("stdDeviation", 4)
    .attr("flood-color", "#888888");

  // 在SVG中添加一個包含所有內容的g元素(對它進行一個平移變換，以便為接下來的元素提供一個留白的區域)
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 繪製每一個系列的柱子
  role.forEach((serie) => {
    let bars = g.append("g")
        .attr("fill", colorScale(serie.key))
        .selectAll("rect")
        .data(serie);
  
    bars.enter().append("rect")
        .attr("x", d => xScale(d.data.value))
        .attr("y", height)
        .attr("width", xScale.bandwidth())
        .attr("height", 0)
        .transition() 
        .duration(options.duration)
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
      .each(function(d) {
        // 此處的代碼將在每個 rect 創建時執行
        if (options.shadow) {
          d3.select(this).attr("filter", "url(#drop-shadow)");
          d3.select(this)
            .on("mouseover", function(d) {
                d3.select(this).attr("fill", "#ffd77f");
            })
            .on("mouseout", function(d) {
                d3.select(this).attr("fill", colorScale(serie.key));
                d3.select(".tooltip").remove();
            });
        }
      });
  });

  // 繪製x軸
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .append("text") // 軸解釋名稱
    .attr("transform", `translate(0,0)`)
    .attr("y", -margin.left)
    .attr("x", -height / 2)
    .attr("dy", "0.71em")
    .attr("fill", "black")
    .text("Count");;

  // 繪製y軸
  g.append("g")
    .call(d3.axisLeft(yScale));

  return svg.node();
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["artistPublic.csv", {url: new URL("./artistPublic.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["artistVer.csv", {url: new URL("./artistVer.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("viewof roleSelection")).define("viewof roleSelection", ["selectionView"], _roleSelection);
  main.variable(observer("roleSelection")).define("roleSelection", ["Generators", "viewof roleSelection"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","artistColumn","uniqueAnswer","artistRole","publicRole","data","roleSelection"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("viewof roleSelection1")).define("viewof roleSelection1", ["selectionView"], _roleSelection1);
  main.variable(observer("roleSelection1")).define("roleSelection1", ["Generators", "viewof roleSelection1"], (G, _) => G.input(_));
  main.variable(observer("chart1")).define("chart1", ["svgStackBarChart","roleSelection1"], _chart1);
  main.variable(observer("viewof roleSelection2")).define("viewof roleSelection2", ["selectionView"], _roleSelection2);
  main.variable(observer("roleSelection2")).define("roleSelection2", ["Generators", "viewof roleSelection2"], (G, _) => G.input(_));
  main.variable(observer("chart2")).define("chart2", ["svgStackBarChart","roleSelection2"], _chart2);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("viewof roleSelection3")).define("viewof roleSelection3", ["selectionView"], _roleSelection3);
  main.variable(observer("roleSelection3")).define("roleSelection3", ["Generators", "viewof roleSelection3"], (G, _) => G.input(_));
  main.variable(observer("chart3")).define("chart3", ["svgStackBarChart","roleSelection3"], _chart3);
  main.variable(observer("publicQuestionnaire")).define("publicQuestionnaire", ["FileAttachment"], _publicQuestionnaire);
  main.variable(observer("artistQuestionnaire")).define("artistQuestionnaire", ["FileAttachment"], _artistQuestionnaire);
  main.variable(observer("artistRole")).define("artistRole", _artistRole);
  main.variable(observer("publicRole")).define("publicRole", _publicRole);
  main.variable(observer("publicColumn")).define("publicColumn", ["publicQuestionnaire"], _publicColumn);
  main.variable(observer("artistColumn")).define("artistColumn", ["artistQuestionnaire"], _artistColumn);
  main.variable(observer("publicAnswer")).define("publicAnswer", ["publicQuestionnaire","publicColumn"], _publicAnswer);
  main.variable(observer("artistAnswer")).define("artistAnswer", ["artistQuestionnaire","artistColumn"], _artistAnswer);
  main.variable(observer("uniqueAnswer")).define("uniqueAnswer", ["publicAnswer","artistAnswer"], _uniqueAnswer);
  main.variable(observer("data")).define("data", ["uniqueAnswer","artistAnswer","artistRole","publicAnswer","publicRole"], _data);
  main.variable(observer("selectionView")).define("selectionView", ["Inputs","artistRole","publicRole"], _selectionView);
  main.variable(observer("svgStackBarChart")).define("svgStackBarChart", ["data","d3","artistRole","publicRole"], _svgStackBarChart);
  return main;
}
