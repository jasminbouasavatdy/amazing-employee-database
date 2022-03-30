-- use db
USE company_db;

-- insert into department
INSERT INTO `department`(department_name)
VALUES
('Engineering'),
('Finance'),
('Human Resources'),
('Sales');
-- insert into role
INSERT INTO `role`(department_id, title, salary)
VALUES
(1,'Sales Lead',  100000),
(2,'Lead Engineer',  150000),
(3,'HR Lead',  145000),
(4,'Software Engineer',  145000);
-- (5,'Salesperson',  80000);

-- insert into employees
INSERT INTO `employee`(role_id, first_name, last_name, manager_id)
VALUES
(1,'Jasmin', 'Bouasavatdy',NULL),
(2,'Samantha', 'Tadlock',NULL),
(3,'Baudelio', 'Hernandez',NULL),
(4,'John', 'Doe',NULL);
-- (5,'Stephen', 'Wilson', );
