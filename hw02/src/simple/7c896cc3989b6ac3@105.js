function _1(md){return(
md`# HW2 Simple baseline (4pt)`
)}

function _data(FileAttachment){return(
FileAttachment("data.json").json()
)}

function _3(Plot,data){return(
Plot.plot({ 
  x: {grid: true, interval: 1},
	y: {grid: true, label: "count"}, 
	marks: [   
		Plot.rectY(data, Plot.binX({y:"count"}, { x:"Year", interval: 1})), 
		Plot.gridY({ interval: 1, stroke:  "white", strokeOpacity: 0.5 })
	]
})
)}

function _adjustmentPlot(Inputs){return(
Inputs.form({
	mt:  Inputs.range([0, 100], {label: "marginTop", step: 1}),
	mr:  Inputs.range([0, 100], {label: "marginRight", step: 1}),
	mb:  Inputs.range([0, 100], {label: "marginBottom", step: 1}),
	ml:  Inputs.range([0, 100], {label: "marginLeft", step: 1})
})
)}

function _5(Plot,adjustmentPlot,data){return(
Plot.plot({  
	marginTop: adjustmentPlot.mt, 
	marginRight: adjustmentPlot.mr, 
	marginBottom: adjustmentPlot.mb, 
	marginLeft: adjustmentPlot.ml,   
	y: {grid: true, label: "count"},  
	marks: [    
		Plot.rectY(data, Plot.binX({y:"count"}, { x:"Year", interval:1, fill:"Gender", tip: true })),    
		Plot.gridY({ interval: 1, stroke: "white", strokeOpacity: 0.5 })
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
  main.variable(observer()).define(["Plot","data"], _3);
  main.variable(observer("viewof adjustmentPlot")).define("viewof adjustmentPlot", ["Inputs"], _adjustmentPlot);
  main.variable(observer("adjustmentPlot")).define("adjustmentPlot", ["Generators", "viewof adjustmentPlot"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","adjustmentPlot","data"], _5);
  return main;
}
