// require inquirer
const inquirer = require('inquirer');
// require sql
const mysql = require('mysql2');
// require console table
require('console.table');
// connection to database
const db = mysql.createConnection(
    {
        user: 'root',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);


const startingPrompt = () => {
    return inquirer.prompt([
        {
            type: 'rawlist',
            message: 'What would you like to do?',
            name: 'options',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Finish',
            ]

        },
    ])
}
const ifChosen = (choices) => {
    if (choices.options === 'View all departments') {
        viewDepartments();

    } if (choices.options === 'View all roles') {
        viewRoles();

    } if (choices.options === 'View all employees') {
        viewEmployees();

    } if (choices.options === 'Add a department') {
       addDepartment();
    } if (choices.options === 'Add a role') {
        addRole();

    } if (choices.options === 'Add an employee') {
        addEmployee();

    } if (choices.options === 'Update an employee role') {
        updateEmployee();

    }if (choices.options === 'Finish'){
        process.exit();
    }
};
// shows the formatted table when chosen
const viewDepartments = function () {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
        init();
    });
}
// shows the formatted table when chosen

const viewRoles = () => {
    db.query('SELECT * FROM role', function (err, results) {
        console.table(results);
        init()
    });

}
// shows the formatted table when chosen

const viewEmployees = () => {
    db.query('SELECT * FROM employee', function (err, results) {
        console.table(results);
        init()
    });

}

const addRole = () => {
    db.query(
        `SELECT id AS value, department_name AS name FROM department`,
        (err, departments) => {
            console.log(departments);
            inquirer.prompt(
            [
                {
                    message: 'What\'s the name of the role you want to add?',
                    name: 'title'
                },
                {
                    type: 'rawlist',
                    message: 'Which department does this role belong to?',
                    name: 'department',
                    choices: departments
                },
                {
                    message: 'What\'s the salary of the role?',
                    name: 'salary'
                },
            ]   

            ).then((answers) => {
               db.query(
                   `INSERT INTO role (title, department_id, salary) VALUES(?,?,?) `,
                   [answers.title, answers.department, answers.salary],
                   (err,result)=>{
                       console.log(result);
                       init();
                   }
               )
            })
        }
    )
}

const addDepartment = () => {
    inquirer.prompt(
        [
            {
                message: 'What\'s the department name you want to add?',
                name: 'department_name'
            },
        ]
    ).then((answers) => {
        console.log(answers);
        db.query(
            'INSERT INTO department SET ?',
            answers,
            (err, result) => {
                if(err){
                    console.log(err)
                }
                console.log(result);
                db.query('SELECT * FROM department', (err, departments) => {
                    if(err){
                        console.log(err);
                    }
                    console.log(`${answers.department_name} added.`);
                    init();
                }
                );
            });
    })
};

const chooseManager = (employee_id) => {
    db.query(`
    SELECT id AS value, 
    CONCAT(first_name, ' ', last_name) AS name 
    FROM employee 
    WHERE NOT id = ?
    `, employee_id, (err, managers) => {
        inquirer.prompt({
            type: 'rawlist',
            message: 'Who\'s the manager?',
            name: 'manager',
            choices: managers
        }).then((answers) => {
            db.query(
                'UPDATE employee SET manager_id = ? WHERE id = ?',
                [answers.manager, employee_id],
                (err, result) => {
                    console.log(result);
                    db.query('SELECT * FROM employee', (err, employees) => {
                        console.log(employees);
                    });
                })
        })
    });
};

const addEmployee = () => {
    inquirer.prompt(
        [
            {
                message: 'What\'s the employee\'s first name?',
                name: 'first_name'
            },
            {
                message: 'What\'s the employee\'s last name?',
                name: 'last_name'
            }
        ]
    ).then((answers) => {
        db.query(
            'INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)',
            [answers.first_name, answers.last_name, 1],
            (err, result) => {
                chooseManager(result.insertId);
            }
        );
    });
};



function init() {
    startingPrompt()
    .then(ifChosen);
}

init();