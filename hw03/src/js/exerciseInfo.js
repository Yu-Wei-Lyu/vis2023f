d3.json("../json/AerobicData.json").then((data) =>{
    const interval = 1000;
    var frame = 0;
    setInterval(() => {
        let current = data[frame];
        d3.select("#distance").text(`Distance: ${current.Distance}`);
        d3.select("#time").text(`Time: ${Math.floor(current.Time / 60)}m${current.Time % 60}s`);
        d3.select("#calorie").text(`Calorie: ${current.Calorie}`);
        frame += 1;
        if (frame >= data.length) {
            frame = 0;
        }
    }, interval);
});