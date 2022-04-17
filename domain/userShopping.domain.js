const UserShoppingModel = require('../model/UserShopping.model');


class UserShoppingDomain {

    // create Preference
    async createPreference(req,res) {
        var Data = req.body;

        let Preference = new UserShoppingModel({
            PreferenceName: Data.PreferenceName
        });

        const NewPreference = await Preference.save();
        if(!NewPreference) res.status(500).send("Can't create a new Preference right now.Please try after some time");

        res.status(200).send(NewPreference);
    }

    // Get all Preference

    async getAllPreference(req,res){
        var Data = await UserShoppingModel.find({IsActive: true});

        if(Data.length < 0) res.status(404).send("No Preference Found!!");

        res.status(200).send(Data);
    }

    // Get specific preference

    async getAnPreferences(req, res){
        var Id = req.query.id;

        const Data = await UserShoppingModel.findById({_id:Id});
        
        if(!Data) res.status(404).send(`Opps! This id: ${Id} of Preference not Found`);

        res.status(200).send(Data);
    }

}

module.exports = UserShoppingDomain;
