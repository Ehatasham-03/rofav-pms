// api/controllers/BanquetManagePlansController.js

const { v4: uuidv4 } = require('uuid');

module.exports = {

  /*   //Decoration Plan is not being used anymore
    createDecorationPlan: async function (req, res) {
      try {
        const { propertyId, planeName, planPrice, planeDescription } = req.body;
  
        if (!propertyId || !planeName || !planPrice || !planeDescription) {
          return res.status(400).json({ error: 'All fields are required' });
        }
  
        const uniqueId = uuidv4();
  
        const decorationPlan = await BanquetManageDecorationPlans.create({
          uniqueId,
          propertyId,
          planeName,
          planPrice,
          planeDescription
        }).fetch();
  
        return res.status(201).json(decorationPlan);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
  
    //Decoration Plan is not being used anymore
    fetchDecorationPlans: async function (req, res) {
      try {
        const { propertyId } = req.query;
  
        if (!propertyId) {
          return res.status(400).json({ error: 'Property ID is required' });
        }
  
        const decorationPlans = await BanquetManageDecorationPlans.find({ propertyId, isDeleted: 'false' });
  
        if (decorationPlans.length === 0) {
          return res.status(404).json({ error: 'No decoration plans found' });
        }
  
        return res.status(200).json(decorationPlans);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
    //Decoration Plan is not being used anymore
    deleteDecorationPlan: async function (req, res) {
      try {
        const { uniqueId } = req.query;
  
        if (!uniqueId) {
          return res.status(400).json({ error: 'Unique ID is required' });
        }
  
        const updatedDecorationPlan = await BanquetManageDecorationPlans.updateOne({ uniqueId }).set({ isDeleted: 'true' });
  
        if (!updatedDecorationPlan) {
          return res.status(404).json({ error: 'Decoration plan not found' });
        }
  
        return res.status(200).json({ message: 'Decoration plan marked as deleted successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
   */



  createFoodPlan: async function (req, res) {
    try {
      const { propertyId, planeName, planPrice, planeDescription, dishes } = req.body;

      if (!propertyId || !planeName) {
        return res.status(400).json({ error: 'Property ID and plane name are required' });
      }

      if (!dishes || dishes.length === 0) {
        return res.status(400).json({ error: 'Dishes are required with at least one dish' });
      }



      const uniqueId = uuidv4();

      const foodPlan = await BanquetManageFoodPlans.create({
        uniqueId,
        propertyId,
        planeName,
        planPrice,
        planeDescription
      }).fetch();

      if (dishes && dishes.length > 0) {
        const dishPromises = dishes.map(dish => {
          return BanquetManageFoodPlansDish.create({
            uniqueId: uuidv4(),
            banquetManageFoodPlans: foodPlan.uniqueId,
            dishName: dish.dishName,
            dishPrice: dish.dishPrice,
            dishDescription: dish.dishDescription
          });
        });

        await Promise.all(dishPromises);
      }

      return res.status(201).json(foodPlan);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  fetchFoodPlans: async function (req, res) {
    try {
      const { propertyId } = req.query;

      if (!propertyId) {
        return res.status(400).json({ error: 'Property ID is required' });
      }

      const foodPlans = await BanquetManageFoodPlans.find({ propertyId, isDeleted: false })
        .populate('dishes', { where: { isDeleted: false } });

      if (foodPlans.length === 0) {
        return res.status(404).json({ error: 'No food plans found' });
      }

      return res.status(200).json(foodPlans);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteFoodPlan: async function (req, res) {
    try {
      const { uniqueId } = req.query;

      if (!uniqueId) {
        return res.status(400).json({ error: 'Unique ID is required' });
      }

      const updatedFoodPlan = await BanquetManageFoodPlans.updateOne({ uniqueId }).set({ isDeleted: true });

      if (!updatedFoodPlan) {
        return res.status(404).json({ error: 'Food plan not found' });
      }

      return res.status(200).json({ message: 'Food plan marked as deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  createDish: async function (req, res) {
    try {
      const { foodPlanId, dishName, dishPrice, dishDescription } = req.body;

      if (!foodPlanId || !dishName || !dishPrice) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const dish = await BanquetManageFoodPlansDish.create({
        uniqueId: uuidv4(),
        banquetManageFoodPlans: foodPlanId,
        dishName,
        dishPrice,
        dishDescription
      }).fetch();

      return res.status(201).json(dish);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteDish: async function (req, res) {
    try {
      const { uniqueId } = req.query;

      if (!uniqueId) {
        return res.status(400).json({ error: 'Unique ID is required' });
      }

      const updatedDish = await BanquetManageFoodPlansDish.updateOne({ uniqueId }).set({ isDeleted: true });

      if (!updatedDish) {
        return res.status(404).json({ error: 'Dish not found' });
      }

      return res.status(200).json({ message: 'Dish marked as deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
