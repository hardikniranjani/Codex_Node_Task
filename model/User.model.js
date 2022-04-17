const Joi = require('joi');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    FullName:{
        type: String,
    },
    Email:{
    },
    Password:{
        type: String,
    },
    DateOfBirth:{
    },
    UserShopping:{
        type:[String],
        ref:'UserShoppingSchema',
    },
    IsActive:{
        type: Boolean,
        default:true
    }
});

const UserModel = mongoose.model("user", userSchema);

function userValidation(){
    const schema = Joi.object({
        FullName: Joi.string().min(3).max(30).required(),
        Email:Joi.string().email().required(),
        DateOfBirth:Joi.date().required()
    })

    return schema.validate();
}

module.exports = { UserModel , userValidation};