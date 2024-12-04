// api/controllers/CreateMaterialsManagementCategories.js

const { v4: uuidv4 } = require('uuid');

module.exports = {
    createMaterialManagementCategories: async (req, res) => {
        try {
            const categories = [
                "Kitchen Management",
                "Laundry Management",
                "House Keeping Management",
                "Electronics Management",
                "Miscellaneous Management"
            ];

            const existingCategories = await MainCategory.find({ name: categories });

            if (existingCategories.length === categories.length) {
                return res.status(200).json(existingCategories);
            }

            const newCategories = [];

            for (const category of categories) {
                const existingCategory = existingCategories.find(cat => cat.name === category);

                if (!existingCategory) {
                    const uniqueId = uuidv4();
                    const newCategory = await MainCategory.create({ uniqueId, name: category, status: 'true' }).fetch();
                    newCategories.push(newCategory);
                }
            }

            const allCategories = [...existingCategories, ...newCategories];
            return res.status(201).json(allCategories);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
};