import mongoose from "mongoose";

const schema = mongoose.Schema;
const object_id = mongoose.Types.ObjectId;


const user_address = new schema ({

    address:{
        type:String,
         required: true,
    },

    user:{
        type: object_id,
        required:true,
        ref:'users',
        unique:true
    }
},{
    timestamps: true
});


export const usr_address = mongoose.model('address', user_address);
