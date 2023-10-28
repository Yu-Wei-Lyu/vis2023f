// https://observablehq.com/@shaunkallis/stacked-horizontal-bar-chart-of-cumulative-homework-score
// 參考 D3 畫廊
let parsed_csv;
let series;
let color_dict;

d3.text("../data/csv/data.csv").then(function (data) {
    parsed_csv = d3.csvParse(data, (d, i, columns) => {
        d3.autoType(d); // 自動檢測並轉換數據類型
        d.total = d3.sum(columns.slice(5), c => d[c]); // 計算總分
        return d;
    });

    parsed_csv.sort((a, b) => b.total - a.total);
    
    series = d3.stack().keys(parsed_csv.columns.slice(5))(parsed_csv).map(d => (d.forEach(v => v.key = d.key), d))
    //console.log(series)
    color_dict = d3.scaleOrdinal()
        .domain(series.map(d => d.key))
        .range(d3.schemeSpectral[series.length] || ["#ccc"]);
    
    CreateHintSVG();
    CreateScoreSVG();
});

//***************************************************
function DomainConverter(student) {
    return `${student.序號} ${student.班級} ${student.學號} ${student.姓名} ${student['GitHub 帳號']}`
}

function CreateHintSVG() {
    const rect_height = 25
    const rect_width = 50
    const score_header = parsed_csv.columns.slice(5);

    // 創建作業顏色對照表的svg
    var hint_svg = d3.create("svg")
        .attr("viewBox", [0, 0, rect_width*score_header.length, rect_height])
    
    // 繪製固定長度的多色矩形
    hint_svg.append("g")
        .attr("id", "score-hint")
        .selectAll("rect")
        .data(score_header)
        .join("rect")
        .attr("fill", d => color_dict(d))
        .attr("x", (d, i) => i * rect_width)
        .attr("y", 0)
        .attr("width", rect_width)
        .attr("height", rect_height)
    
    // 於多色矩形之上添加"作業X"文字
    hint_svg.select("#score-hint")
        .selectAll("text")
        .data(score_header)
        .join("text")
        .attr("class", "rect-text")
        .attr("x", (d, i) => (i) * rect_width + 24)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", 10)
        .text(d => d);

    d3.select("#div1")
        .style("font-size", "28pt")
        .style("width", "70%")
        .style("margin", "5px auto")
        .style("padding", "10px")
        .style("text-align", "center")
        .append("g")
        .text("作業顏色對照表")
    
    d3.select("#div1").node().appendChild(hint_svg.node());

}

function CreateScoreSVG() {
    var margin = ({top: 30, right: 10, bottom: 0, left: 250});

    var width = 900
    var height = parsed_csv.length * 25 + margin.top + margin.bottom;

    var formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en");
    
    var y = d3.scaleBand()
        .domain(parsed_csv.map(d => {
            return DomainConverter(d);
        }))
        .range([margin.top, height - margin.bottom])
        .padding(0.08);

    var x = d3.scaleLinear()
        //.domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        .domain([0, 100])
        .range([margin.left, width - margin.right]);
     
    var yAxis = g => g.attr("transform", `translate(0,0)`)
        
        .call(d3.axisRight(y).tickFormat(d => d))
        .call(g => g.selectAll("g").select("line").remove());
        

    var xAxis = g => g.attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisTop(x).ticks(width / 50, "s"))
        .call(g => g.selectAll(".domain").remove());

    var score_svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height]);
    
    score_svg.append("g")
        .attr("id", "chart")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", d => color_dict(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => x(d[0]))
        .attr("y", (d, i) => y(DomainConverter(d.data)))
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth())
        .append("title")
        .text(d => `${d.data.姓名} ${d.key} 分數 ${formatValue(d.data[d.key])}`)
    
    score_svg.append("g")
        .call(xAxis);
    
    score_svg.append("g")
        .call(yAxis);

    // 添加 text 元素，確保它在 rect 之後
    score_svg.select("#chart")
        .selectAll("g")
        .data(series)
        .join("g")
        .selectAll("text")
        .data(d => d)
        .join("text")
        .attr("class", "rect-text")
        .attr("x", d => x(d[0]) + (x(d[1]) - x(d[0])) / 2)
        .attr("y", (d, i) => y(DomainConverter(d.data)) + 16)
        .attr("text-anchor", "middle")
        .attr("font-size", 12)
        .text(function(d) {
            score = d[1] - d[0];
            if (score != 0) {
                return score;
            }
            else {
                return "";
            }
        });
    
    d3.select("#div2")
        .style("width", "90%") 
        .style("margin", "5px auto") 
        .node()
        .appendChild(score_svg.node());
}