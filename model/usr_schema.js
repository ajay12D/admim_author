import mongoose from "mongoose";

const schema = mongoose.Schema;


const usr_schema = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    is_admin:{
        type:Boolean,
        default: false
    }
},{
    timestamps: true
});


export const User = mongoose.model('users', usr_schema);
