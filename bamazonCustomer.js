var mysql = require('mysql');
var inquirer = require('inquirer');
//require Table to format the output from the Mysql database
var Table = require("terminal-table");
//new Table object to format table
var t = new Table({
    borderStyle: 2,
    horizontalLine: true,
    rightPadding: 0,
    leftPadding: 1,
    width: ["10%", "60%", "6%"]
});
//database credentials
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Alqu1m14#1",
    database: "bamazonDB"
});
//connection to the database
connection.connect(err => {
    if (err) throw err
});
//quering the database to output everything in products Table
connection.query("SELECT * FROM products", (error, results) => {
    if (error) throw error;
    //set up the table headers
    t.push(["Item ID", "Product Name", "Price"]);
    //set up the table content
    results.forEach(item => {
        t.push([item.item_id, item.product_name, item.price])
    })

    /* Range */
    t.attrRange({
        row: [0, 1]
    }, {
        align: "center",
        color: "blue"
    });

    console.log("" + t);

});