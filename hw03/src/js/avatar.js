// 由 variables.js 提供 intervalSpeed 變數

d3.json("../json/userLocationData.json").then((data) => {
    const dataList = data.dataList;
    // 樓層資訊為 1~4 樓 floorNumbers = [1, 2, 3, 4] 
    const floorNumbers = d3.range(1, 5);
    // 樓層的標籤區域
    const floors = d3.select("#building").selectAll(".floor").data(floorNumbers);
    // user icon 的圓半徑
    const avatarRadius = 15;
    var frame = 0;

    // 於每個樓層都建立 user 圖標
    floors.append("img")
        .classed("avatar", true)
        .style("width", `${avatarRadius * 2}px`)
        .style("top", `0px`)
        .style("left", `0px`)
        .style("visibility", "hidden")
        .attr("src", "../svg/userIcon.svg");

    // 顯示 user 所在樓層即時的位置 其餘樓層的 icon 隱藏
    function userLocationUpdate() {
        const current = dataList[frame];

        floors.select(".avatar") 
            .style("visibility", d => (`${d}F` == current.Floor) ? "visible" : "hidden")
            .filter(d => `${d}F` == current.Floor)
            .style("top", `calc(${current.Y + 50}% - ${avatarRadius}px)`) // 此值為理解資料特性後的修正值
            .style("left", `calc(${current.X}% - ${avatarRadius}px`) // 此值為理解資料特性後的修正值
            .raise(); 
        
        frame += 1;
        if (frame >= dataList.length) {
            frame = 0;
        }
    }

    // 動畫播放
    setInterval(userLocationUpdate, intervalSpeed);
});

// 透過了解資料移動範圍與實際位置資訊 得知資料座標系統的呈現方式
// d3.json("../json/userLocationData.json").then((data) => {
//     var dataList = data.dataList;
//     var movementScope = {
//         minX:dataList[0].X, 
//         minY:dataList[0].Y, 
//         maxX:dataList[0].X, 
//         maxY:dataList[0].Y
//     };
//     dataList.forEach(data => {
//         if (data.X < movementScope.minX)
//             movementScope.minX = data.X;
//         if (data.X > movementScope.maxX)
//             movementScope.maxX = data.X;
//         if (data.Y < movementScope.minY)
//             movementScope.minY = data.Y;
//         if (data.Y > movementScope.maxY)
//             movementScope.maxY = data.Y;
//     });
//     console.log(movementScope) // {minX: -3.417552947998047, minY: -42.042171478271484, maxX: 57.95524597167969, maxY: 25.27315902709961}
// });