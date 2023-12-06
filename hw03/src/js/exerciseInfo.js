// 由 variables.js 提供 intervalSpeed 變數

d3.json("../json/AerobicData.json").then((data) =>{
    var frame = 0;

    // 顯示即時的運動資訊
    function exerciseInfoUpdate() {
        const current = data[frame];
        d3.select("#distance").text(`Distance: ${current.Distance} meters`);
        d3.select("#time").text(`Time: ${Math.floor(current.Time / 60)}min ${current.Time % 60}sec`);
        d3.select("#calorie").text(`Calorie: ${current.Calorie} calories`);
        frame += 1;
        if (frame >= data.length) {
            frame = 0;
        }
    }

    // 動畫播放
    setInterval(exerciseInfoUpdate, intervalSpeed);
});