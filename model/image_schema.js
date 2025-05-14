import mongoose from "mongoose";
import { type } from "os";
const schema = mongoose.Schema;
const object_id = mongoose.Types.ObjectId;



const img_schema = new schema({
    image:String,
    user:{
        type:object_id,
        ref:'user',
        required:true
    }
}, {
     timestamps: true
})

export const identity= mongoose.model('img', img_schema);