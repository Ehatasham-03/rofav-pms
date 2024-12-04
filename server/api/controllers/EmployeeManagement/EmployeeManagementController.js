// api/controllers/EmployeeManagementController.js

const { v4: uuidv4 } = require('uuid');

module.exports = {

    createDesignation: async (req, res) => {
        try {

            const { propertyId, name, status } = req.body;

            if (!propertyId || !name) {
                return res.status(400).json({ error: 'Property ID, name and restaurant ID are required' });
            }


            const alreadyExists = await EmployeeDesignations.findOne({ name });
            if (alreadyExists) {
                return res.status(400).json({ error: 'Name already exists' });
            }

            const uniqueId = uuidv4();

            const designation = await EmployeeDesignations.create({
                uniqueId,
                propertyId,
                name,
                status: status
            }).fetch();
            return res.status(201).json(designation);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    fetchDesignation: async (req, res) => {
        try {
            const { propertyId } = req.query;
            if (!propertyId) {
                return res.status(400).json({ error: 'Property ID is required' });
            }


            const designation = await EmployeeDesignations.find({ propertyId });

            return res.status(200).json(designation);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // EMPLOYEE MANAGEMENT

    createEmployee: async (req, res) => {
        try {
            const {
                propertyId,
                name,
                phoneNumber,
                address,
                designationUniqueId,
                dateOfJoining,
                department,
                gender,
                nokName,
                nokPhone,
                nokAddress,
                nokRelationship,
                avatar,
                documentType,
                panCard,
                status,
            } = req.body;

            if (
                !propertyId ||
                !name ||
                !phoneNumber ||
                !address ||
                !designationUniqueId ||
                !dateOfJoining ||
                !department
            ) {
                return res.status(400).json({
                    error:
                        'Property ID, name, phone number, address, designation unique ID, date of joining, and department are required',
                });
            }

            const uniqueId = uuidv4();

            const employee = await Employee.create({
                uniqueId,
                propertyId,
                name,
                phoneNumber,
                address,
                designation: designationUniqueId,
                dateOfJoining,
                department,
                gender: gender || 'null',
                nokName,
                nokPhone,
                nokAddress,
                nokRelationship,
                avatar,
                documentType: documentType || 'null',
                panCard,
                status: status || 'active',
            }).fetch();

            return res.status(201).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    fetchEmployees: async (req, res) => {
        try {
            const { propertyId, designationUniqueId, department, status } = req.query;

            if (!propertyId) {
                return res.status(400).json({ error: 'Property ID is required' });
            }

            const query = { propertyId };

            if (designationUniqueId) {
                query.designation = designationUniqueId;
            }

            if (department) {
                query.department = department;
            }

            if (status) {
                query.status = status;
            }

            const employees = await Employee.find(query).populate('designation');

            const employeesWithDesignationDetails = employees.map((employee) => ({
                ...employee,
                designation: employee.designation
                    ? [
                        {
                            uniqueId: employee.designation.uniqueId,
                            name: employee.designation.name,
                            status: employee.designation.status,
                        },
                    ]
                    : [],
            }));

            return res.status(200).json(employeesWithDesignationDetails);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    updateEmployee: async (req, res) => {
        try {
            const { uniqueId } = req.query;
            const {
                name,
                phoneNumber,
                address,
                designationUniqueId,
                dateOfJoining,
                department,
                gender,
                nokName,
                nokPhone,
                nokAddress,
                nokRelationship,
                avatar,
                documentType,
                panCard,
                status,
            } = req.body;

            if (!uniqueId) {
                return res.status(400).json({ error: 'Employee ID is required' });
            }

            const updatedData = {};

            if (name) updatedData.name = name;
            if (phoneNumber) updatedData.phoneNumber = phoneNumber;
            if (address) updatedData.address = address;
            if (designationUniqueId) updatedData.designation = designationUniqueId;
            if (dateOfJoining) updatedData.dateOfJoining = dateOfJoining;
            if (department) updatedData.department = department;
            if (gender) updatedData.gender = gender;
            if (nokName) updatedData.nokName = nokName;
            if (nokPhone) updatedData.nokPhone = nokPhone;
            if (nokAddress) updatedData.nokAddress = nokAddress;
            if (nokRelationship) updatedData.nokRelationship = nokRelationship;
            if (avatar) updatedData.avatar = avatar;
            if (documentType) updatedData.documentType = documentType;
            if (panCard) updatedData.panCard = panCard;
            if (status) updatedData.status = status;

            const updatedEmployee = await Employee.updateOne({ uniqueId }).set(
                updatedData
            );

            if (updatedEmployee) {
                return res.status(200).json({ message: 'Employee updated successfully' });
            } else {
                return res.status(404).json({ error: 'Employee not found' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    deleteEmployee: async (req, res) => {
        try {
            const { uniqueId } = req.query;

            if (!uniqueId) {
                return res.status(400).json({ error: 'Employee ID is required' });
            }

            const deletedEmployee = await Employee.destroyOne({ uniqueId });

            if (deletedEmployee) {
                return res.status(200).json({ message: 'Employee deleted successfully' });
            } else {
                return res.status(404).json({ error: 'Employee not found' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

