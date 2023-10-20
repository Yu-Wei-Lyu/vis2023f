d3.select("#div1")
    .append("table")
    .append("tr")
    .selectAll("td")
    .data([10,9,8,7,6,5,4,3,2,1,0])
    .enter()
    .append("td")
    .text(function (d, i) {
        if (i <= 10 || isNaN(d)) {
            return d;
        }
    })
    .attr("class", function (d, i) { 
        return GetAppleCSS(d);
    })
    .append("img")
    .attr("src", function (d, i) { 
        return GetAppleSVG(d);
    })
    .attr("x", "0")
    .attr("y", "0")
    .attr("width",  function(d, i) { return (i + 1) * 60; })
    .attr("height", function(d, i) { return (i + 1) * 60; });

d3.text("../data/csv/data.csv").then(function (data) {
    //console.log(data)
    parsedCSV = d3.csvParseRows(data);
    //console.log(parsedCSV);

    var container = d3.select("#div2")
        .append("table")
        .attr("id", "score-table")
        .selectAll("tr")
        .data(parsedCSV)
        .enter()
        .append("tr")
        .selectAll("td")
        .data(function (d) { return d; }).enter()
        .append("td")
        .html(function (d, i) {
            if ( i == 4 && d != 'GitHub 帳號' ) {
                return '<a href="https://github.com/' + d + '/vis2023f/" target="_blank">' + d + '</a>';
            }
            else if ( i == 3 && d != "姓名") {
                d3.select(this).attr("class", "clear-font");
                return d;
            }
            else if ( i == 0 || i == 2 || isNaN(d)) {
                return d;
            }
        })
        .filter(function (d, i) {
            return KeepScoreField(d, i); 
        })
        .attr("class", function (d, i) { 
            return GetAppleCSS(d);
        })
        .append("img")
        .attr("src", function (d, i) {
            return GetAppleSVG(d);
        })
        .attr("width", 50)
        .attr("height", 50);
    }
);

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