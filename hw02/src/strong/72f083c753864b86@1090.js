function _1(md){return(
md`# HW2 Strong baseline (2pt)`
)}

function _data(FileAttachment){return(
FileAttachment("data.json").json()
)}

function _constellationChinese(){return(
["牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "天蠍座", "射手座", "摩羯座", "水瓶座", "雙魚座"]
)}

function _barChartData(){return(
new Array(function() {})
)}

function _histogramOrder(){return(
new Object()
)}

function _6(barChartData,constellationChinese,data,createHistogramOrder)
{
  barChartData.length = 0;
  for (var i = 0; i < constellationChinese.length; i++) {
    barChartData.push({constellation: constellationChinese[i], gender: "male", count: 0});
    barChartData.push({constellation: constellationChinese[i], gender: "female", count: 0});
  }
  data.forEach(item => {
    var categoryIndex = item.Constellation*2 + (item.Gender == "男" ? 0 : 1);
    barChartData[categoryIndex].count++;
  });
  createHistogramOrder();
  return "All data process completed";
}


function _createHistogramOrder(histogramOrder,barChartData,pushToHistogramOrder){return(
function createHistogramOrder() {
  histogramOrder.constellationOrder = [];
  histogramOrder.genderCountOrder = [];
  var constellationPointer = 0;
  for (var i = 1; i < barChartData.length; i += 2) {
    pushToHistogramOrder(barChartData[i], constellationPointer);
    constellationPointer++;
  }
  constellationPointer = 0;
  for (var i = 0; i < barChartData.length; i += 2) {
    pushToHistogramOrder(barChartData[i], constellationPointer);
    constellationPointer++;
  }
  return histogramOrder;
}
)}

function _pushToHistogramOrder(histogramOrder,constellationChinese){return(
function pushToHistogramOrder(barChartItem, constellationPointer) {
  if (barChartItem.count !== 0) {
    histogramOrder.constellationOrder.push(constellationChinese[constellationPointer]);
    histogramOrder.genderCountOrder.push(`${barChartItem.gender == "female" ? "女" : "男"} (${barChartItem.count})`);
  }
}
)}

function _9(Plot,constellationChinese,barChartData){return(
Plot.plot({
  x: {
    grid: true,
    domain: constellationChinese
  },
  y: { grid: true },
  marks: [
    Plot.ruleY([0]),
    Plot.barY(barChartData, {
      x: "constellation",
      y: "count",
      fill : "gender",
      channels: {
        constellation: {
          value: "constellation",
          label: "Constellation"
        },
        gender: {
          value: "gender",
          label: "gender"
        }
      },
      tip: {
        format: {
          y: d => d,
          x: false,
          fill: false,
        }
      }
    })
  ]
})
)}

function _10(Plot,constellationChinese,data,histogramOrder){return(
Plot.plot({
  x: { // 找好久的tick設定: https://observablehq.com/plot/marks/axis#axis-mark
    grid: true,
    tickSpacing: 35,
    tickFormat: (d) => constellationChinese[d]
  },
  y: {
    grid: true,
    label: "Count"
  },
  marks: [
    Plot.rectY(data, Plot.binX(
      { 
        y: "count" 
      }, 
      {
        x: "Constellation", 
        interval: 1, 
        fill: "Gender",
        channels: {
          constellation: {
            value: histogramOrder.constellationOrder,
            label: "Constellation"
          },
          gender: {
            value: histogramOrder.genderCountOrder,
            label: "gender"
          }
        },
        tip: {
          format: {
            y: false,
            x: false,
            fill: false
          }
        }
      }
    ))
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
  main.variable(observer("constellationChinese")).define("constellationChinese", _constellationChinese);
  main.variable(observer("barChartData")).define("barChartData", _barChartData);
  main.variable(observer("histogramOrder")).define("histogramOrder", _histogramOrder);
  main.variable(observer()).define(["barChartData","constellationChinese","data","createHistogramOrder"], _6);
  main.variable(observer("createHistogramOrder")).define("createHistogramOrder", ["histogramOrder","barChartData","pushToHistogramOrder"], _createHistogramOrder);
  main.variable(observer("pushToHistogramOrder")).define("pushToHistogramOrder", ["histogramOrder","constellationChinese"], _pushToHistogramOrder);
  main.variable(observer()).define(["Plot","constellationChinese","barChartData"], _9);
  main.variable(observer()).define(["Plot","constellationChinese","data","histogramOrder"], _10);
  return main;
}
