import mongoose from "mongoose";
const schema = mongoose.Schema;


const otp_schema =  new schema({
    name: {
        type: String,
        required: 'true'
    },

    email:{
        type: String,
        required: true,
    },
    otp : {
        type: String,
        required:true
    }
},{
    timestamps: true
});

export const Otp = mongoose.model('otp', otp_schema);