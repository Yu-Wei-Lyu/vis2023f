d3.json("../json/AerobicData.json").then((data) =>{
    var interval = 1000;
    var frame = 0;
    var maxFrame = data.length;
    var move = setInterval(() => {
        let currentData = data[frame];
        console.log(data[frame].X, data[frame].Y);
        frame += 1;
    }, interval);
});