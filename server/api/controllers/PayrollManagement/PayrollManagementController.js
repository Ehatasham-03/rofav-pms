// api/controllers/PayrollManagementController.js

const { v4: uuidv4 } = require('uuid');

module.exports = {
    create: async function (req, res) {
        try {
            const {
                propertyId,
                employeeId,
                paymentType,
                basicPay,
                arrears,
                bonus,
                misc,
                loansAmount,
                taxInPercentage,
                advanceOrLoan,
                totalAmmount
            } = req.body;

            if (!propertyId || !employeeId || !paymentType) {
                return res.status(400).json({ error: 'propertyId, employeeId, and paymentType are required fields' });
            }

            const existingEmployee = await Employee.findOne({ uniqueId: employeeId });
            if (!existingEmployee) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            if (propertyId !== existingEmployee.propertyId) {
                return res.status(400).json({ error: 'Employee does not belong to this property' });
            }


            const newPayroll = await PayrollManagement.create({
                uniqueId: uuidv4(),
                propertyId,
                employeeId,
                employeeName: existingEmployee.name,
                paymentType,
                basicPay,
                arrears,
                bonus,
                misc,
                loansAmount,
                taxInPercentage,
                advanceOrLoan,
                totalAmmount
            }).fetch();

            if (!newPayroll) {
                return res.status(500).json({ error: 'Failed to create payroll' });
            }
            return res.status(201).json(newPayroll);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    find: async function (req, res) {
        try {
            const { propertyId, employeeId, paymentType } = req.query;

            const query = {};

            if (propertyId) {
                query.propertyId = propertyId;
            }

            if (employeeId) {
                query.employeeId = employeeId;
            }

            if (paymentType) {
                query.paymentType = paymentType;
            }

            const payrolls = await PayrollManagement.find(query);

            return res.json(payrolls);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    update: async function (req, res) {
        try {
            const { uniqueId } = req.params;
            const updateData = req.body;

            if (!uniqueId) {
                return res.status(400).json({ error: 'uniqueId is required' });
            }

            const updatedPayroll = await PayrollManagement.updateOne({ uniqueId })
                .set(updateData)
                .fetch();

            if (!updatedPayroll) {
                return res.status(404).json({ error: 'Payroll not found' });
            }

            return res.json(updatedPayroll);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    delete: async function (req, res) {
        try {
            const { uniqueId } = req.params;

            if (!uniqueId) {
                return res.status(400).json({ error: 'uniqueId is required' });
            }

            const deletedPayroll = await PayrollManagement.destroyOne({ uniqueId });

            if (!deletedPayroll) {
                return res.status(404).json({ error: 'Payroll not found' });
            }

            return res.json({ message: 'Payroll deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};