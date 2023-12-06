// 由 variables.js 提供 intervalSpeed 變數

d3.json("../json/userLocationData.json").then((data) => {
    const dataList = data.dataList;
    // 樓層資訊為 1~4 樓 floorNumbers = [1, 2, 3, 4] 
    const floorNumbers = d3.range(1, 5);
    // 樓層的標籤區域
    const floors = d3.select("#building").selectAll(".floor").data(floorNumbers);    
    var frame = 0;

    // 創建路徑畫布
    floors.append("div").classed("grid", true);

    // 顯示 user 所在樓層即時的位置 其餘樓層的 icon 隱藏
    function avatarMove() {
        const current = dataList[frame];

        floors.filter(d => `${d}F` == current.Floor)
            .select(".grid")
            .append("div")
            .classed("dot", true)
            .style("top", `${current.Y + 50}%`) // 此值為理解資料特性後的修正值
            .style("left", `${current.X}%`); // 此值為理解資料特性後的修正值

        frame += 1;
        if (frame >= dataList.length) {
            d3.selectAll(".dot").remove();
            frame = 0;
        }
    }

    // 動畫播放
    setInterval(avatarMove, intervalSpeed);
});