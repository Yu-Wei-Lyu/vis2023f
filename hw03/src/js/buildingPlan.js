function generateFloorPlan() {
    // 樓層資訊為 1~4 樓 floorNumbers = [1, 2, 3, 4] 
    const floorNumbers = d3.range(1, 5);
    // 樓層的標籤區域
    const floors = d3.select("#building").selectAll(".floor").data(floorNumbers);
    
    // 每個樓層的標頭文字
    floors.append("p")
        .style("position", "absolute")
        .style("top", "0px")
        .style("left", "0px")
        .style("margin", "4px")
        .text(d => `師大美術館 ${d} 樓展廳`);

    // 每個樓層的平面圖
    floors.append("img")
        .style("width", "100%")
        .style("height", "auto")
        .attr("src", d => `../svg/${d}F.svg`);
}

generateFloorPlan();
