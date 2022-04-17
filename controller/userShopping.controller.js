const express = require('express');
const UserShoppingDomain = require('../domain/userShopping.domain');
const router = express.Router();

class userShoppingController {
    // Get all Preferences 
    static async getAllPreferences(req,res) {
        const userShoppingDomain = new UserShoppingDomain();
        userShoppingDomain.getAllPreference(req, res);
    }

    // Get Specific Preference
    static async getAnPreferences(req,res) {
        const userShoppingDomain = new UserShoppingDomain();
        userShoppingDomain.getAnPreferences(req, res);
    }

    // Create Preference
    static async createPreferences(req,res) {
        const userShoppingDomain = new UserShoppingDomain();
        userShoppingDomain.createPreference(req, res);
    }
}

// Get all preferences
router.get("/",userShoppingController.getAllPreferences);

// Get Specific Preference
router.get("/single",userShoppingController.getAnPreferences);

// Create Preference
router.post("/",userShoppingController.createPreferences);

module.exports = router;