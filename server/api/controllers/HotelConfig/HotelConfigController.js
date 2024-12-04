//api/controllers/HotelConfig/HotelConfigController.js

const { v4: uuidv4 } = require('uuid');

module.exports = {
    create: async function (req, res) {
        try {
            const {
                propertyId,
                companyName,
                companyPanNumber,
                corporateOfficeAddress,
                branches,
                logoLink,
                tinNumber,
                fssaiNumber,
                gstinNumber,
                description,
                status
            } = req.body;

            if (!propertyId || !companyName) {
                return res.status(400).json({ success: false, message: 'Property ID and company name are required' });
            }

            const uniqueId = uuidv4();
            const hotelConfig = await HotelConfig.create({
                uniqueId,
                propertyId,
                companyName,
                companyPanNumber,
                corporateOfficeAddress,
                branches,
                logoLink,
                tinNumber,
                fssaiNumber,
                gstinNumber,
                description,
                status
            }).fetch();

            return res.status(201).json({ success: true, message: 'Hotel Config created successfully', data: hotelConfig });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Failed to create Hotel Config', error: error.message });
        }
    },

    

    get: async function (req, res) {
        try {
            const { propertyId, companyName, uniqueId } = req.query;

            let query = { propertyId };

            if (!propertyId) {
                return res.status(400).json({ success: false, message: 'Property ID is required' });
            }

            if (companyName) query.companyName = companyName;
            if (uniqueId) query.uniqueId = uniqueId;

            const hotelConfig = await HotelConfig.find(query);
            return res.status(200).json({ success: true, data: hotelConfig });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Failed to fetch Hotel Config', error: error.message });
        }
    },

    update: async function (req, res) {
        try {
            const { uniqueId } = req.query;

            const {
                companyName,
                companyPanNumber,
                corporateOfficeAddress,
                branches,
                logoLink,
                tinNumber,
                fssaiNumber,
                gstinNumber,
                description,
                status
            } = req.body;

            if (!uniqueId) {
                return res.status(400).json({ success: false, message: 'uniqueId is required' });
            }

            const hotelConfig = await HotelConfig.findOne({ uniqueId });

            if (!hotelConfig) {
                return res.status(404).json({ success: false, message: 'Hotel Config not found' });
            }

            const updatedHotelConfig = await HotelConfig.updateOne({ uniqueId })
                .set({
                    companyName: companyName || hotelConfig.companyName,
                    companyPanNumber: companyPanNumber || hotelConfig.companyPanNumber,
                    corporateOfficeAddress: corporateOfficeAddress || hotelConfig.corporateOfficeAddress,
                    branches: branches || hotelConfig.branches,
                    logoLink: logoLink || hotelConfig.logoLink,
                    tinNumber: tinNumber || hotelConfig.tinNumber,
                    fssaiNumber: fssaiNumber || hotelConfig.fssaiNumber,
                    gstinNumber: gstinNumber || hotelConfig.gstinNumber,
                    description: description || hotelConfig.description,
                    status: status !== undefined ? status : hotelConfig.status
                });

            return res.status(200).json({ success: true, message: 'Hotel Config updated successfully', data: updatedHotelConfig });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Failed to update Hotel Config', error: error.message });
        }
    },

    delete: async function (req, res) {
        try {
            const { uniqueId } = req.query;
            if (!uniqueId) {
                return res.status(400).json({ success: false, message: 'uniqueId is required' });
            }
            const deletedHotelConfig = await HotelConfig.destroyOne({ uniqueId });
            if (!deletedHotelConfig) {
                return res.status(404).json({ success: false, message: 'Hotel Config not found' });
            }
            return res.status(200).json({ success: true, message: 'Hotel Config deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Failed to delete Hotel Config', error: error.message });
        }
    }
};