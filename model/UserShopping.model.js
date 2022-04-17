const mongoose = require('mongoose');

const UserShoppingSchema = new mongoose.Schema({
    PreferenceName:{
        type:String,
        required:true
    },
    IsActive:{
        type:Boolean,
        default:true
    }
});

const UserShoppingModel = mongoose.model('UserShoppingSchema', UserShoppingSchema)

module.exports = UserShoppingModel;