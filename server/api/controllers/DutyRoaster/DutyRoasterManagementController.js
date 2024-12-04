const { v4: uuidv4 } = require('uuid');

module.exports = {

    /* Responsibilities */
    createResponsibilities: async (req, res) => {
        try {
            const { propertyId, name } = req.body;

            if (!propertyId || !name) {
                return res.status(400).json({ success: false, message: 'Property ID and name are required' });
            }

            const uniqueId = uuidv4();

            const newResponsibility = await DutyRoasterResponsibilities.create({
                uniqueId,
                propertyId,
                name
            }).fetch();

            return res.json({ success: true, message: 'Responsibilities created successfully', data: newResponsibility });
        } catch (error) {
            sails.log.error('Error creating responsibilities:', error);
            return res.status(500).json({ success: false, message: 'An error occurred while creating responsibilities' });
        }
    },

    fetchResponsibilities: async (req, res) => {
        try {
            const { propertyId, uniqueId, name } = req.query;
            let query = {};
            if (propertyId) query.propertyId = propertyId;
            if (uniqueId) query.uniqueId = uniqueId;
            if (name) query.name = { contains: name };

            const responsibilities = await DutyRoasterResponsibilities.find(query);
            return res.json({ success: true, data: responsibilities });
        } catch (error) {
            sails.log.error('Error fetching responsibilities:', error);
            return res.status(500).json({ success: false, message: 'An error occurred while fetching responsibilities' });
        }
    },

    deleteResponsibilities: async (req, res) => {
        try {
            const { propertyId, uniqueId, name } = req.query;
            if (!propertyId || (!uniqueId && !name)) {
                return res.status(400).json({ success: false, message: 'Property ID, and either unique ID or name are required' });
            }

            let query = { propertyId };
            if (uniqueId) query.uniqueId = uniqueId;
            if (name) query.name = name;

            const deletedResponsibilities = await DutyRoasterResponsibilities.destroy(query).fetch();
            return res.json({ success: true, message: 'Responsibilities deleted successfully', data: deletedResponsibilities });
        } catch (error) {
            sails.log.error('Error deleting responsibilities:', error);
            return res.status(500).json({ success: false, message: 'An error occurred while deleting responsibilities' });
        }
    },

    /* Shifts */


    createShift: async (req, res) => {
        try {
            const { propertyId, name, startTime, endTime } = req.body;

            if (!propertyId || !name || !startTime || !endTime) {
                return res.status(400).json({ success: false, message: 'Property ID, name, start time, and end time are required' });
            }

            const uniqueId = uuidv4();

            const newShift = await DutyRoasterShifts.create({
                uniqueId,
                propertyId,
                name,
                startTime,
                endTime
            }).fetch();

            return res.json({ success: true, message: 'Shift created successfully', data: newShift });
        } catch (error) {
            sails.log.error('Error creating shift:', error);
            return res.status(500).json({ success: false, message: 'An error occurred while creating shift' });
        }
    },

    fetchShift: async (req, res) => {
        try {
            const { propertyId, uniqueId, name } = req.query;
            let query = {};
            if (propertyId) query.propertyId = propertyId;
            if (uniqueId) query.uniqueId = uniqueId;
            if (name) query.name = { contains: name };

            const shifts = await DutyRoasterShifts.find(query);
            return res.json({ success: true, data: shifts });
        } catch (error) {
            sails.log.error('Error fetching shifts:', error);
            return res.status(500).json({ success: false, message: 'An error occurred while fetching shifts' });
        }
    },

    deleteShift: async (req, res) => {
        try {
            const { propertyId, uniqueId, name } = req.query;
            if (!propertyId || (!uniqueId && !name)) {
                return res.status(400).json({ success: false, message: 'Property ID, and either unique ID or name are required' });
            }

            let query = { propertyId };
            if (uniqueId) query.uniqueId = uniqueId;
            if (name) query.name = name;

            const deletedShifts = await DutyRoasterShifts.destroy(query).fetch();
            return res.json({ success: true, message: 'Shifts deleted successfully', data: deletedShifts });

        } catch (error) {
            sails.log.error('Error deleting shifts:', error);
            return res.status(500).json({ success: false, message: 'An error occurred while deleting shifts' });
        }
    },


    /* Duty Roaster */

    create: async function (req, res) {
        try {
            const { propertyId, date, shiftUniqueId, responsibilitiesUniqueIds, employeesUniqueIds, additionalResponsibilities } = req.body;

            if (!propertyId || !date || !shiftUniqueId || !responsibilitiesUniqueIds || !employeesUniqueIds) {
                return res.badRequest('Property ID, date, shift unique ID, responsibilities unique IDs, and employees unique IDs are required');
            }


            // Generate a new UUID
            const uniqueId = uuidv4();



            // Create the duty roster
            const newDutyRoster = await DutyRoaster.create({
                uniqueId,
                propertyId,
                date,
                shift: shiftUniqueId,
                additionalResponsibilities,
            }).fetch();


            await Promise.all(responsibilitiesUniqueIds.map(async (responsibilityId) => {
                await DutyRoasterResponsibilities.updateOne({ uniqueId: responsibilityId })
                    .set({ dutyRoaster: newDutyRoster.uniqueId });
            }));

            await Promise.all(employeesUniqueIds.map(async (employeeId) => {
                await Employee.updateOne({ uniqueId: employeeId })
                    .set({ dutyRoaster: newDutyRoster.uniqueId });
            }));

            const populatedDutyRoster = await DutyRoaster.findOne({ uniqueId: newDutyRoster.uniqueId })
                .populate('shift')
                .populate('responsibilities')
                .populate('employees');

            return res.ok({
                message: 'Duty roster created successfully',
                data: populatedDutyRoster
            });
        } catch (error) {
            sails.log.error('Error creating duty roster:', error);
            return res.serverError('An error occurred while creating duty roster');
        }
    },

    // Fetch duty roster
    fetch: async function (req, res) {
        try {
            const { propertyId, uniqueId, shiftName, shiftUniqueId } = req.query;

            if (!propertyId && !uniqueId && !shiftName && !shiftUniqueId) {
                return res.badRequest('At least one search criterion is required');
            }

            const query = {};

            if (propertyId) {
                query.propertyId = propertyId;
            }

            if (uniqueId) {
                query.uniqueId = uniqueId;
            }

            if (shiftName) {
                const shift = await DutyRoasterShifts.findOne({ name: shiftName });
                if (shift) {
                    query.shift = shift.uniqueId;
                }
            }

            if (shiftUniqueId) {
                query.shift = shiftUniqueId;
            }

            const dutyRosters = await DutyRoaster.find(query)
                .populate('shift')
                .populate('responsibilities')
                .populate('employees');


            return res.ok({
                message: 'Duty rosters fetched successfully',
                data: dutyRosters
            });
        } catch (error) {
            sails.log.error('Error fetching duty rosters:', error);
            return res.serverError('An error occurred while fetching duty rosters');
        }
    },

    // Update duty roster
    update: async function (req, res) {
        try {

            const { uniqueId } = req.query;

            const { propertyId, date, shiftUniqueId, responsibilitiesUniqueIds, employeesUniqueIds } = req.body;

            if (!uniqueId) {
                return res.badRequest('Duty roster unique ID is required');
            }

            const dutyRoster = await DutyRoaster.findOne({ uniqueId });

            if (!dutyRoster) {
                return res.status(404).json({ message: 'Duty roster not found' });
            }


            // Update the duty roster
            await DutyRoaster.updateOne({ uniqueId })
                .set({
                    propertyId: propertyId || dutyRoster.propertyId,
                    date: date || dutyRoster.date,
                    shift: shiftUniqueId || dutyRoster.shift
                });

            // Update associated responsibilities
            if (responsibilitiesUniqueIds) {
                await DutyRoasterResponsibilities.update({ dutyRoaster: uniqueId })
                    .set({ dutyRoaster: null });

                await Promise.all(responsibilitiesUniqueIds.map(async (responsibilityId) => {
                    await DutyRoasterResponsibilities.updateOne({ uniqueId: responsibilityId })
                        .set({ dutyRoaster: uniqueId });
                }));
            }

            // Update associated employees
            if (employeesUniqueIds) {
                await Employee.update({ dutyRoaster: uniqueId })
                    .set({ dutyRoaster: null });

                await Promise.all(employeesUniqueIds.map(async (employeeId) => {
                    await Employee.updateOne({ uniqueId: employeeId })
                        .set({ dutyRoaster: uniqueId });
                }));
            }

            // Fetch the updated duty roster with populated relationships
            const updatedDutyRoster = await DutyRoaster.findOne({ uniqueId })
                .populate('shift')
                .populate('responsibilities')
                .populate('employees');

            return res.ok({
                message: 'Duty roster updated successfully',
                data: updatedDutyRoster
            });
        } catch (error) {
            sails.log.error('Error updating duty roster:', error);
            return res.serverError('An error occurred while updating duty roster');
        }
    },

    // Delete duty roster
    delete: async function (req, res) {
        try {

            const { uniqueId } = req.query;

            if (!uniqueId) {
                return res.badRequest('Duty roster unique ID is required');
            }

            const dutyRoster = await DutyRoaster.findOne({ uniqueId });

            if (!dutyRoster) {

                return res.status(404).json({
                    message: 'Duty roster not found'
                });
            }

            // Remove associated responsibilities
            await DutyRoasterResponsibilities.update({ dutyRoaster: uniqueId })
                .set({ dutyRoaster: null });

            // Remove associated employees
            await Employee.update({ dutyRoaster: uniqueId })
                .set({ dutyRoaster: null });

            // Delete the duty roster
            await DutyRoaster.destroyOne({ uniqueId });

            return res.ok({
                message: 'Duty roster deleted successfully'
            });
        } catch (error) {
            sails.log.error('Error deleting duty roster:', error);
            return res.serverError('An error occurred while deleting duty roster');
        }
    }
};