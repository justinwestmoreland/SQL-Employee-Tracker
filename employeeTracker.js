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

connection.connect((err) => {
    if (err) throw err;
    start();
});