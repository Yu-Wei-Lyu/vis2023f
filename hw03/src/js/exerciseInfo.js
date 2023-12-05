d3.json("../json/AerobicData.json").then((data) =>{
    var interval = 1000;
    var frame = 0;
    var maxFrame = data.length;
    var move = setInterval(() => {
        let currentData = [data[frame].Distance, data[frame].Time, data[frame].Calorie];
        d3.select("#exerciseInfo").selectAll("p").data([currentData.Distance])
        console.log(currentData);
        frame += 1;
    }, interval);
});