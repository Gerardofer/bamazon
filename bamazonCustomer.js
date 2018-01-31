var mysql = require('mysql');
//prompts the user for input
var inquirer = require('inquirer');
//require Table to format the output from the Mysql database
var Table = require("terminal-table");

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

// //Run inquirer
// askItem();

//quering the database to output everything in products Table
connection.query("SELECT * FROM products", (error, results) => {
    if (error) throw error;
    //new Table object to format table
    var t = new Table({
        borderStyle: 2,
        horizontalLine: true,
        rightPadding: 0,
        leftPadding: 1,
        width: ["10%", "60%", "8%"]
    });
    //set up the table headers
    t.push(["Item ID", "Product Name", "Price"]);
    //set up the table content
    results.forEach(item => {
            t.push([item.item_id, item.product_name, ("$ " + item.price)])
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

//Run inquirer
askItem();

function askItem() {
    inquirer.prompt([{
            type: "input",
            name: "item_id",
            message: "Please select the Item ID you want to purchase"
        },
        {
            type: "input",
            name: "stock_quatity",
            message: "Please select a quantity"
        }
    ]).then(answers => {
        // console.log(answers.item_id);
        connection.query("SELECT product_name, stock_quatity, price FROM products WHERE item_id =" + answers.item_id, (err, res) => {
            if (err) {
                console.error(message.error)
            };

            var s = new Table({
                borderStyle: 2,
                horizontalLine: true,
                rightPadding: 0,
                leftPadding: 1,
                width: ["60%", "12%", "6%"]
            });

            s.push(["Product Name", "Order", "Price"])
            s.push([res[0].product_name, answers.stock_quatity, ("$ " + res[0].price)]);
            s.attrRange({
                row: [0, 1]
            }, {
                align: "center",
                color: "blue"
            });
            console.log("" + s);
            console.log(answers.item_id)

            if ((res[0].stock_quatity - answers.stock_quatity) > 0) {
                console.log("Your request is being fullfilled");
                console.log("Your total is: " + "$ " + (answers.stock_quatity * res[0].price));
                connection.query("UPDATE products SET stock_quatity = stock_quatity - " + answers.stock_quatity + " WHERE ?", [{ item_id: answers.item_id }], function(error, res) {
                    if (error) {
                        console.error(error.message)
                    }

                    // console.log(res);
                    // console.log("There are " + res[0].stock_quatity + " left in the inventory for " + res[0].product_name);
                })
            } else {
                console.log("We do not currently have enough inventory to fulfill this order")
            }
        })
    })
}