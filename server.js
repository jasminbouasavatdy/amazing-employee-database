// require inquirer
const inquirer = require('inquirer');
// require sql
const mysql = require('mysql2');
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
                'Update an employee role',
                'Finish',
            ]

        },
    ])
}
const ifChosen = (choices) => {
    if (choices.options === 'View all departments') {
        viewDepartments()
    } if (choices.options === 'View all roles') {
        viewRoles()
    } if (choices.options === 'View all employees') {
        viewEmployees()
    } if (choices.options === 'Add a department') {
        addDepartment()
    } if (choices.options === 'Add a role') {
        addRole()
    } if (choices.options === 'Add an employee') {
        addEmployee()
    } if (choices.options === 'Update an employee role') {
        updateEmployee()
    }if (choices.options === 'Finish'){
        process.exit()
    }
    init();

};
const viewDepartments = () => {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
        startingPrompt()
    });
}

const viewRoles = () => {
    db.query('SELECT * FROM role', function (err, results) {
        console.table(results);
        startingPrompt()

    });

}

const viewEmployees = () => {
    db.query('SELECT * FROM employee', function (err, results) {
        console.table(results);
        startingPrompt()

    });

}
// bonus
// const updateEmployee = (employee_id) => {
//     db.query(
//         `SELECT id AS value, employee_id AS name FROM employee
//         WHERE NOT id = ?`,
//         employee_id,(err,employee) => {
//             inquirer.prompt({
//                 type: 'rawlist',
//                 message: 'Which employee did you want to update?',
//                 name:'employee',
//                 choices: employee
//             }).then((answers)=> {
//                 db.query(
//                     'UPDATE employee SET role_id = ? WHERE id = ?',
//                     [answers.employee,employee_id],
//                     (err,result) => {
//                         console.log(result);
//                         db.query('SELECT * FROM employee', (err,employees)=>{
//                             console.log(employees); 
//                         })
//                     }
//                 )
//             })
//         }
//     )
// }

const addRole = () => {
    db.query(
        `SELECT id AS value, department_name AS name FROM department`,
        (err, departments) => {
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
        db.query(
            'INSERT INTO department (department_name) VALUES (?)',
            [answers.department_name],
            (err, result) => {
                console.log(result);
                db.query('SELECT * FROM department', (err, departments) => {
                    console.log(departments);
                }
                );
            });
        startingPrompt()
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