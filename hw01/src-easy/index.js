// https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

// Initialize admission year
let admission_year_array = [
    '111', 
    '112'
]

// Initialize class name and code
let class_type = [
    ['資工系', '590'],
    ['資工所', '598'],
    ['電資AI', 'C52'],
    ['電資資安', 'C53'],
    ['創新AI', 'C71']
]

// Initialize student score rows, including field header
let student_quantity = 120;
let info_columns = 13;
let score_rows = createArray(student_quantity + 1, info_columns);
score_rows[0] = ['序號', '班級', '學號', '姓名', 'GitHub 帳號', '作業一', '作業二', '作業三', '作業四', '作業五', '作業六', '作業七', '作業八', '作業九', '作業十']

// Add random data into student rows
for (var i = 1; i < score_rows.length; i++) {
    let random_class_info = class_type[RandomInt(0, class_type.length - 1)]
    let class_name = random_class_info[0];
    let class_code = random_class_info[1];
    let admission_year = admission_year_array[RandomInt(0, admission_year_array.length - 1)];
    let random_serial_num = RandomInt(0, 999).toString().padStart(3, '0');
    let student_id = admission_year + class_code + random_serial_num;
    score_rows[i][0] = i;
    score_rows[i][1] = class_name;
    score_rows[i][2] = student_id;
    score_rows[i][3] = RandomChineseChar() + RandomChineseChar() + RandomChineseChar();
    score_rows[i][4] = RandomAlphanumericString(10);

    for (var j = 5; j < score_rows[0].length; j++) {
        score_rows[i][j] = RandomInt(0, 10);
    }
}

// https://medium.com/wdstack/quick-blurb-generating-a-table-from-an-array-in-javascript-41386fd449a9
//setup our table array
var tableArr = [
  ["row 1, cell 1", "row 1, cell 2"],
  ["row 2, cell 1", "row 2, cell 2"]
]
//create a Table Object
let table = document.createElement('table');
//iterate over every array(row) within tableArr
for (let row of score_rows) {
//Insert a new row element into the table element
  table.insertRow();
//Iterate over every index(cell) in each array(row)
  for (let cell of row) {
//While iterating over the index(cell)
//insert a cell into the table element
    let newCell = table.rows[table.rows.length - 1].insertCell();
//add text to the created cell element
    newCell.textContent = cell;
  }
}
//append the compiled table to the DOM
document.body.appendChild(table);

function tableToCSV() {

    // Variable to store the final csv data
    var csv_data = [];

    // Get each row data
    var rows = document.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {

        // Get each column data
        var cols = rows[i].querySelectorAll('td,th');

        // Stores each csv row data
        var csvrow = [];
        for (var j = 0; j < cols.length; j++) {

            // Get the text data of each cell
            // of a row and push it to csvrow
            csvrow.push(cols[j].innerHTML);
        }

        // Combine each column value with comma
        csv_data.push(csvrow.join(","));
    }

    // Combine each row data with new line character
    csv_data = csv_data.join('\n');

    // Call this function to download csv file 
    downloadCSVFile(csv_data);

}

function downloadCSVFile(csv_data) {

    // Create CSV file object and feed
    // our csv_data into it
    CSVFile = new Blob([csv_data], {
        type: "text/csv"
    });

    // Create to temporary link to initiate
    // download process
    var temp_link = document.createElement('a');

    // Download csv file
    temp_link.download = "data.csv";
    var url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;

    // This link should not be displayed
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);

    // Automatically click the link to
    // trigger download
    temp_link.click();
    document.body.removeChild(temp_link);
}

function RandomInt(min_num, max_num) {
    return Math.floor(Math.random() * (max_num + 1) + min_num)
}

function RandomChineseChar() {
    return String.fromCharCode(RandomInt(0x4e00, 0x51ff))
}

function RandomAlphanumericString(length) {
    const alphanumeric_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var result_string = "";
    for (var i = 0; i < length; i++) {
        let RandomChar = alphanumeric_chars.charAt(RandomInt(0, alphanumeric_chars.length - 1));
        result_string += RandomChar;
    }
    return result_string;
}