d3.json("../json/userLocationData.json").then((data) => {
    const userInfo = data.dataList;
    console.log(userInfo)
});