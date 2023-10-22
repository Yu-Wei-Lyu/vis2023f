// https://observablehq.com/@shaunkallis/stacked-horizontal-bar-chart-of-cumulative-homework-score
// 參考 D3 畫廊
// 測試分數和顏色的數據
const testScores = ['Test A', 'Test B', 'Test C'];
const colors = ['#ff0000', '#00ff00', '#0000ff'];

// student-scores-in-homeworks
// data
d3.text("../data/csv/data.csv").then(function (data) {
//d3.text("../data/csv/student-scores-in-homeworks.csv").then(function (data) {
    const parsed_csv = d3.csvParse(data, (d, i, columns) => {
        d3.autoType(d); // 自動檢測並轉換數據類型
        d.total = d3.sum(columns.slice(5), c => d[c]); // 計算總分
        return d;
    });

    parsed_csv.sort((a, b) => b.total - a.total);
    
    series = d3.stack().keys(parsed_csv.columns.slice(5))(parsed_csv).map(d => (d.forEach(v => v.key = d.key), d))
    //console.log(series)
    margin = ({top: 30, right: 10, bottom: 0, left: 112});

    width = 900
    height = parsed_csv.length * 25 + margin.top + margin.bottom;

    formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en");

    yAxis = g => g.attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call(g => g.selectAll(".domain").remove());

    xAxis = g => g.attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisTop(x).ticks(width / 50, "s"))
        .call(g => g.selectAll(".domain").remove());

    color = d3.scaleOrdinal()
        .domain(series.map(d => d.key))
        .range(d3.schemeSpectral[series.length] || ["#ccc"]);

    y = d3.scaleBand()
        .domain(parsed_csv.map(d => d.姓名))
        .range([margin.top, height - margin.bottom])
        .padding(0.08);

    x = d3.scaleLinear()
        //.domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        .domain([0, 100])
        .range([margin.left, width - margin.right]);

    score_svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height]);
    
    score_svg.append("g")
        .attr("id", "chart")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => x(d[0]))
        .attr("y", (d, i) => y(d.data.姓名))
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth())
        // .append("title")
        // .text(d => `${d.data.name} ${d.key} ${formatValue(d.data[d.key])});`)
    
    score_svg.select("#chart")
    
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
        .attr("x", d => x(d[0]) + (x(d[1]) - x(d[0])) / 2)
        .attr("y", (d, i) => y(d.data.姓名) + 16)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-family", "'Noto Serif JP', serif")
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
    
    d3.select("#div2").node().appendChild(score_svg.node());

    hint_block_width = 50
    hint_svg = d3.create("svg")
        .attr("viewBox", [0, 0, hint_block_width*10, 50])
    console.log(parsed_csv.columns.slice(5))
    hint_svg.append("g")
        .attr("id", "score-hint")
        .selectAll("rect")
        .data(parsed_csv.columns.slice(5))
        .join("rect")
        .attr("fill", d => color(d))
        .attr("x", (d, i) => (i) * hint_block_width)
        .attr("y", 0)
        .attr("width", hint_block_width)
        .attr("height", 10)
    
    //添加 text 元素，確保它在 rect 之後
    hint_svg.select("#score-hint")
        .selectAll("text")
        .data(parsed_csv.columns.slice(5))
        .join("text")
        .attr("x", (d, i) => (i) * hint_block_width + 24)
        .attr("y", 8)
        .attr("text-anchor", "middle")
        .attr("font-size", 8)
        .attr("fill", "white")
        .text(d => d);
    
    d3.select("#div1")
        .append("text")
        .text("作業顏色對照表")
    d3.select("#div1").append("div").attr("style", null).node().appendChild(hint_svg.node());
});

//***************************************************

function RandomInt(min_num, max_num) {
    return Math.floor(Math.random() * (max_num + 1) + min_num)
}

function KeepScoreField(data, column_index) {
    return column_index > 2 && !isNaN(data) && data != "";
}

function GetAppleCSS(state) {
    if (state == 10) return "excellent-kid"; 
    else if (state >= 7 ) return "good-kid"; 
    else if (state >= 2 ) return "fair-kid"; 
    else return "poor-kid";
}

function GetAppleSVG(state) {
    const img_folder = "../data/svg/";
    if (state == 10) return img_folder + "52.svg";
    else if (state == 9) return img_folder + "51.svg";
    else if (state == 8) return img_folder + "42.svg";
    else if (state == 7) return img_folder + "41.svg";
    else if (state == 6) return img_folder + "32.svg";
    else if (state == 5) return img_folder + "31.svg";
    else if (state == 4) return img_folder + "22.svg";
    else if (state == 3) return img_folder + "21.svg";
    else if (state == 2) return img_folder + "12.svg";
    else if (state == 1) return img_folder + "11.svg";
    else if (state == 0) return img_folder + "01.svg";
    else return img_folder + "00.svg";
}