const Employee = require('../models/Employee');

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { name, email, contact } = req.body;

    if (!email || !name || !contact) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newEmployee = new Employee({ name, email, contact });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    console.log(error);
    
    res.status(400).json({ message: "Phone can't be same or something else error",error });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

module.exports = { getAllEmployees, createEmployee, deleteEmployee };
