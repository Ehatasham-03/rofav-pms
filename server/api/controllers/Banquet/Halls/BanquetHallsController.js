// api/controllers/BanquetHallsController.js

const { v4: uuidv4 } = require('uuid');

module.exports = {
    createHall: async function (req, res) {
        try {
            const { propertyId, hallName, seatingCapacity, typeOfBanquet, facilitiesProvided, suitableFor, rentPerDay } = req.body;

            if (!propertyId || !hallName || !seatingCapacity || !typeOfBanquet || !rentPerDay) {
                return res.status(400).json({ error: 'propertyId, hallName, seatingCapacity, typeOfBanquet, and rentPerDay are required' });
            }

            if (!facilitiesProvided || facilitiesProvided.length === 0) {
                return res.status(400).json({ error: 'At least one facility must be provided' });
            }

            if (!suitableFor || suitableFor.length === 0) {
                return res.status(400).json({ error: 'At least one suitableFor item must be provided' });
            }

            const banquetType = await BanquetTypes.findOne({ uniqueId: typeOfBanquet });
            if (!banquetType) {
                return res.status(400).json({ error: 'Invalid typeOfBanquet' });
            }

            const existingFacilities = await BanquetFacilities.find({ uniqueId: { in: facilitiesProvided } });
            if (existingFacilities.length !== facilitiesProvided.length) {
                const missingFacilities = facilitiesProvided.filter(id => !existingFacilities.some(f => f.uniqueId === id));
                return res.status(400).json({ error: 'Some facilities do not exist', missingFacilities });
            }

            const existingSuitables = await BanquetSuitable.find({ uniqueId: { in: suitableFor } });
            if (existingSuitables.length !== suitableFor.length) {
                const missingSuitables = suitableFor.filter(id => !existingSuitables.some(s => s.uniqueId === id));
                return res.status(400).json({ error: 'Some suitables do not exist', missingSuitables });
            }

            const uniqueId = uuidv4();

            const hall = await BanquetManageHalls.create({
                uniqueId,
                propertyId,
                hallName,
                seatingCapacity,
                typeOfBanquet: banquetType.uniqueId,
                rentPerDay
            }).fetch();

            console.log('Created hall:', hall);

            const createdFacilities = await BanquetHallFacility.createEach(
                existingFacilities.map(facility => ({
                    banquetHall: hall.uniqueId,
                    facility: facility.uniqueId
                }))
            ).fetch();
            console.log('Created facilities:', createdFacilities);

            const createdSuitables = await BanquetHallSuitable.createEach(
                existingSuitables.map(suitable => ({
                    banquetHall: hall.uniqueId,
                    suitable: suitable.uniqueId
                }))
            ).fetch();
            console.log('Created suitables:', createdSuitables);

            const updatedHall = await BanquetManageHalls.findOne({ uniqueId: hall.uniqueId });

            const hallFacilities = await BanquetHallFacility.find({ banquetHall: hall.uniqueId }).populate('facility');
            updatedHall.facilitiesProvided = hallFacilities.map(hf => hf.facility).filter(Boolean);

            const hallSuitables = await BanquetHallSuitable.find({ banquetHall: hall.uniqueId }).populate('suitable');
            updatedHall.suitableFor = hallSuitables.map(hs => hs.suitable).filter(Boolean);

            updatedHall.typeOfBanquet = banquetType;

            return res.status(201).json(updatedHall);
        } catch (error) {
            console.error('Error in createHall:', error);
            return res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    },

    fetchHalls: async function (req, res) {
        try {
            const { propertyId } = req.query;

            if (!propertyId) {
                return res.status(400).json({ error: 'propertyId is required' });
            }

            const halls = await BanquetManageHalls.find({ propertyId })
                .populate('typeOfBanquet')
                .populate('facilitiesProvided', { isDeleted: false })
                .populate('suitableFor', { isDeleted: false });

            return res.status(200).json(halls);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    updateHall: async function (req, res) {
        try {
            const { uniqueId } = req.query;
            const { hallName, seatingCapacity, typeOfBanquet, facilitiesProvided, suitableFor, rentPerDay, status } = req.body;

            if (!uniqueId) {
                return res.status(400).json({ error: 'uniqueId is required' });
            }

            const updatedHall = await BanquetManageHalls.updateOne({ uniqueId })
                .set({
                    hallName,
                    seatingCapacity,
                    typeOfBanquet,
                    rentPerDay,
                    status
                });

            if (facilitiesProvided && facilitiesProvided.length > 0) {
                await updatedHall.facilitiesProvided.addToCollection(facilitiesProvided);
            }

            if (suitableFor && suitableFor.length > 0) {
                await updatedHall.suitableFor.addToCollection(suitableFor);
            }

            return res.status(200).json(updatedHall);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    deleteHall: async function (req, res) {
        try {
            const { uniqueId } = req.query;

            if (!uniqueId) {
                return res.status(400).json({ error: 'uniqueId is required' });
            }

            const deletedHall = await BanquetManageHalls.destroyOne({ uniqueId });

            if (!deletedHall) {
                return res.status(404).json({ error: 'Hall not found' });
            }

            return res.status(200).json({ message: 'Hall deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};