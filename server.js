// require inquirer
// req express
const inquirer = require("inquirer");
// const startingPrompt = () => {
    inquirer.prompt([
        {
            type: 'rawlist',
            message: 'What would you like to do?',
            name:'startingPrompt',
            choices: ['View all departments', 'View all roles', ' View all employees', 'Add a department', 'Add a role', ' Add an employee', 'update and employee role']

        },
    ])
// }
const init = () => {

};

init();