//used to configure our connection to the db
const connection = require("./connection");
//this is our class for the entire database
class DB {
  // this is a reference to the connection on the class we will use
  constructor(connection) {
    this.connection = connection;
  }

  // function that will query  all employees, including additional data such as salary, role, etc.
  findAllEmployees() {
    return this.connection.promise().query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
  }

  // function to query all employees except the employee id
  findAllPossibleManagers(employeeId) {
    return this.connection.promise().query(
      "SELECT id, first_name, last_name FROM employee WHERE id != ?",
      employeeId
    );
  }

  // function to create a new employee
  createEmployee(employee) {
    return this.connection.promise().query("INSERT INTO employee SET ?", employee);
  }

  // function to delete an employee using their EID
  removeEmployee(employeeId) {
    return this.connection.promise().query(
      "DELETE FROM employee WHERE id = ?",
      employeeId
    );
  }

  // function to update the employee's role
  updateEmployeeRole(employeeId, roleId) {
    return this.connection.promise().query(
      "UPDATE employee SET role_id = ? WHERE id = ?",
      [roleId, employeeId]
    );
  }

  // function to update the employee's manager
  updateEmployeeManager(employeeId, managerId) {
    return this.connection.promise().query(
      "UPDATE employee SET manager_id = ? WHERE id = ?",
      [managerId, employeeId]
    );
  }

  // function to query all roles, join with departments to display the department name
  findAllRoles() {
    return this.connection.promise().query(
      "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
    );
  }

  // function to create a new role
  createRole(role) {
    return this.connection.promise().query("INSERT INTO role SET ?", role);
  }

  // function to remove a role
  removeRole(roleId) {
    return this.connection.promise().query("DELETE FROM role WHERE id = ?", roleId);
  }

  // function to query all departments
  findAllDepartments() {
    return this.connection.promise().query(
      "SELECT department.id, department.name FROM department;"
    );
  }

  // function to find all departments, and to join with employees and roles and sum up utilized department budget
  viewDepartmentBudgets() {
    return this.connection.promise().query(
      "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
    );
  }

  // function to create new department
  createDepartment(department) {
    return this.connection.promise().query("INSERT INTO department SET ?", department);
  }

  // function to delete a department
  removeDepartment(departmentId) {
    return this.connection.promise().query(
      "DELETE FROM department WHERE id = ?",
      departmentId
    );
  }

  // function to query all employees by department
  findAllEmployeesByDepartment(departmentId) {
    return this.connection.promise().query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;",
      departmentId
    );
  }

  // function to query  all employees by manager
  findAllEmployeesByManager(managerId) {
    return this.connection.promise().query(
      "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;",
      managerId
    );
  }
}

module.exports = new DB(connection);
