// api/models/PayrollManagement.js

module.exports = {
    tableName: 'payrollManagement',
    primaryKey: 'uniqueId',

    attributes: {
        id: {
            type: 'number',
            autoIncrement: true,
            columnName: 'id' 
        },
        uniqueId: {
            type: 'string',
            required: true,
            unique: true
        },

        propertyId: {
            type: 'string',
            required: true
        },

        //Employee Unique Id
        employeeId: {
            model: 'Employee'
        },
        employeeName: {
            type: 'string',
            required: true
        },

        //Could be "salary" or "advance"
        paymentType: {
            type: 'string',
            isIn: ['salary', 'advance'],
            defaultsTo: 'salary'
        },

        // SALARY PAY IS BELOW WHICH SHOULD 
        // BE SHARED WITH
        // ADVANCE PAY TYPE TOO

        //Salary 
        basicPay: {
            type: 'number',
        },
        //Salary 
        arrears: {
            type: 'number',
        },
        //Salary 
        bonus: {
            type: 'number',
        },
        //Shared
        misc: {
            type: 'number',
        },

        //Adavance Pay
        loansAmmount: {
            type: 'number',
        },

        //Adavance Pay
        TaxInPercentage: {
            type: 'number',
        },

        //Advances/Loans
        advanceOrLoan: {
            type: 'string',
        },

        totalAmmount: {
            type: 'number',
        },

    },

}