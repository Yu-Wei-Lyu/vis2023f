// 樓層號碼為 1~4, 由 d3 生成 [1, 2, 3, 4]
var floorNumbers = d3.range(1, 5); 

const building = d3.select("#building");

// 每個樓層的標頭文字
building.selectAll("div")
    .data(floorNumbers)
    .append("p")
    .style("text-align", "center")
    .text(d => `師大美術館 ${d} 樓展廳`);

// 每個樓層的平面圖
building.selectAll("div")
    .data(floorNumbers)
    .append("img")
    .style("width", "100%")
    .attr("src", d => `../svg/${d}F.svg`);