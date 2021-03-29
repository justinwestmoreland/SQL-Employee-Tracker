const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootroot',
    database: 'employee_tracker',
});

const start = () => {
    inquirer
        .prompt({
            name: 'welcome',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'View Roles',
                'View Departments',
                'Add Employee',
                'Add Role',
                'Add Department',
                'EXIT'
            ],
        })
        .then((answer) => {
            // based on their answer, either call the bid or the post functions
            if (answer.welcome === 'View All Employees') {
                viewEmployees();
            } else if (answer.welcome === 'View Roles') {
                viewRoles();
            } else if (answer.welcome === 'View Departments') {
                viewDepartments();
            } else if (answer.welcome === 'Add Employee') {
                addEmployee();
            } else if (answer.welcome === 'Add Role') {
                addRole();
            } else if (answer.welcome === 'Add Department') {
                addDepartment();
            } else {
                connection.end();
            }
        });
};

const viewEmployees = () => {
    connection.query('SELECT * FROM employee', (err, data) => {
        if (err) throw err;
        console.table(data);
        start();
    });
}

const viewRoles = () => {
    connection.query('SELECT * FROM role', (err, data) => {
        if (err) throw err;
        console.table(data);
        start();
    });
}

const viewDepartments = () => {
    connection.query('SELECT * FROM department', (err, data) => {
        if (err) throw err;
        console.table(data);
        start();
    });
}

const addEmployee = () => {
    inquirer
        .prompt([{
                name: 'firstName',
                type: 'input',
                message: 'Employee First Name?',
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'Employee Last Name',
            },
        ])
        .then((answer) => {
            connection.query(
                'INSERT INTO employee SET ?', {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                },

                (err) => {
                    if (err) throw err;
                    console.log('Your Employee has been successfully entered!');
                    start();
                }
            );
        });
};

const addRole = () => {
    inquirer
        .prompt([{
                name: 'title',
                type: 'input',
                message: 'Job Title',
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Job Salary',
            },
        ])
        .then((answer) => {
            connection.query(
                'INSERT INTO role SET ?', {
                    title: answer.title,
                    salary: answer.salary,
                },

                (err) => {
                    if (err) throw err;
                    console.log('Your Role has been successfully entered!');
                    start();
                }
            );
        });
};

const addDepartment = () => {
    inquirer
        .prompt([{
            name: 'department',
            type: 'input',
            message: 'Name of Department?',
        }, ])
        .then((answer) => {
            connection.query(
                'INSERT INTO department SET ?', {
                    name: answer.department,
                },

                (err) => {
                    if (err) throw err;
                    console.log('Your Department has been successfully entered!');
                    start();
                }
            );
        });
};



// const bidAuction = () => {
//     // query the database for all items being auctioned
//     connection.query('SELECT * FROM auctions', (err, results) => {
//         if (err) throw err;
//         // once you have the items, prompt the user for which they'd like to bid on
//         inquirer
//             .prompt([{
//                     name: 'choice',
//                     type: 'rawlist',
//                     choices() {
//                         const choiceArray = [];
//                         results.forEach(({ item_name }) => {
//                             choiceArray.push(item_name);
//                         });
//                         return choiceArray;
//                     },
//                     message: 'What auction would you like to place a bid in?',
//                 },
//                 {
//                     name: 'bid',
//                     type: 'input',
//                     message: 'How much would you like to bid?',
//                 },
//             ])
//             .then((answer) => {
//                 // get the information of the chosen item
//                 let chosenItem;
//                 results.forEach((item) => {
//                     if (item.item_name === answer.choice) {
//                         chosenItem = item;
//                     }
//                 });

//                 // determine if bid was high enough
//                 if (chosenItem.highest_bid < parseInt(answer.bid)) {
//                     // bid was high enough, so update db, let the user know, and start over
//                     connection.query(
//                         'UPDATE auctions SET ? WHERE ?', [{
//                                 highest_bid: answer.bid,
//                             },
//                             {
//                                 id: chosenItem.id,
//                             },
//                         ],
//                         (error) => {
//                             if (error) throw err;
//                             console.log('Bid placed successfully!');
//                             start();
//                         }
//                     );
//                 } else {
//                     // bid wasn't high enough, so apologize and start over
//                     console.log('Your bid was too low. Try again...');
//                     start();
//                 }
//             });
//     });
// };

connection.connect((err) => {
    if (err) throw err;
    start();
});