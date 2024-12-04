// src/api/controllers/BanquetBookingController.js

const { v4: uuidv4 } = require('uuid');

module.exports = {
    create: async function (req, res) {
        try {
            const {
                propertyId, bookerName, selectedHall, selectedFoodPlan,
                pax, taxes, addOns, addOnsCost,
                discounts, discountAmount, discountType, totalCost,
                bookingDateAndTime, bookingEndDateAndTime, bookerPhoneNumber
            } = req.body;

            if (!propertyId || !bookerName || !selectedHall || !selectedFoodPlan ||
                !pax || !taxes || !bookingDateAndTime ||
                !bookingEndDateAndTime || !bookerPhoneNumber) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const [hall, foodPlan] = await Promise.all([
                BanquetManageHalls.findOne({ uniqueId: selectedHall }),
                BanquetManageFoodPlans.findOne({ uniqueId: selectedFoodPlan })
            ]);

            if (!hall || !foodPlan) {
                return res.status(400).json({ error: 'Invalid hall or food plan' });
            }

            const newBooking = await BanquetBookings.create({
                uniqueId: uuidv4(),
                propertyId,
                bookerName,
                bookerPhoneNumber,
                selectedHall,
                selectedFoodPlan,
                pax,
                taxes,
                addOns: addOns || '',
                addOnsCost: addOnsCost || 0,
                discounts: discounts || false,
                discountAmount: discountAmount || 0,
                discountType: discountType || '',
                totalCost,
                bookingDateAndTime,
                bookingEndDateAndTime,
                bookingStatus: 'pending'
            }).fetch();

            return res.status(201).json(newBooking);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    },

    find: async function (req, res) {
        try {
            const { propertyId, uniqueId } = req.query;

            if (!propertyId) {
                return res.status(400).json({ error: 'Missing propertyId in query' });
            }

            let query = { uniqueId };

            const bookings = await BanquetBookings.find(query)
                .populate('selectedHall')
                .populate('selectedFoodPlan');

            if (uniqueId && bookings.length === 0) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            return res.status(200).json(bookings);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    },

    update: async function (req, res) {
        try {
            const { propertyId, uniqueId } = req.query;

            if (!propertyId) {
                return res.status(400).json({ error: 'Missing propertyId in query' });
            }

            if (!uniqueId) {
                return res.status(400).json({ error: 'Missing uniqueId in query' });
            }

            const {
                selectedHall,
                selectedFoodPlan,
                pax,
                totalCost,
                bookingDateAndTime,
                bookingEndDateAndTime,
                bookingStatus
            } = req.body;

            const updateFields = {};
            if (selectedHall) updateFields.selectedHall = selectedHall;
            if (selectedFoodPlan) updateFields.selectedFoodPlan = selectedFoodPlan;
            if (pax !== undefined) updateFields.pax = pax;
            if (totalCost !== undefined) updateFields.totalCost = totalCost;
            if (bookingDateAndTime) updateFields.bookingDateAndTime = bookingDateAndTime;
            if (bookingEndDateAndTime) updateFields.bookingEndDateAndTime = bookingEndDateAndTime;
            if (bookingStatus) updateFields.bookingStatus = bookingStatus;

            if (bookingStatus && !['pending', 'active', 'inActive', 'cancelled'].includes(bookingStatus)) {
                return res.status(400).json({ error: 'Invalid status' });
            }

            if (selectedHall || selectedFoodPlan) {
                const [hall, foodPlan] = await Promise.all([
                    selectedHall ? BanquetManageHalls.findOne({ uniqueId: selectedHall }) : null,
                    selectedFoodPlan ? BanquetManageFoodPlans.findOne({ uniqueId: selectedFoodPlan }) : null
                ]);

                if ((selectedHall && !hall) || (selectedFoodPlan && !foodPlan)) {
                    return res.status(400).json({ error: 'Invalid hall or food plan' });
                }
            }

            const updatedBooking = await BanquetBookings.updateOne({ uniqueId, propertyId }).set(updateFields);

            if (!updatedBooking) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            return res.status(200).json(updatedBooking);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    },

    delete: async function (req, res) {
        try {
            const { propertyId, uniqueId } = req.query;

            if (!propertyId) {
                return res.status(400).json({ error: 'Missing propertyId in query' });
            }

            if (!uniqueId) {
                return res.status(400).json({ error: 'Missing uniqueId in query' });
            }

            const deletedBooking = await BanquetBookings.destroyOne({ uniqueId, propertyId });

            if (!deletedBooking) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            return res.status(200).json({ message: 'Booking deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    }
};