import { json2csv } from "json-2-csv";
import path from "path";
import * as url from 'url';
import cors from 'cors';
import { User } from "../model/usr_schema.js";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import fs from 'fs/promises'
import { identity } from "../model/image_schema.js";
import { usr_address } from "../model/address_schema.js";


export const csvConverter = async (req,res) => {
  const {user_id} = req;

    const dateTime = Date.now();

    const filePath = path.join(__dirname, '../public', `${dateTime}.csv`);

  let csv;
    const fields = [ 'email', 'username', 'is_admin','image', 'address' ,'_id'];


        try{
            const usr = await User.find({ '_id': {$ne: user_id}}).select('-password').select('-__v').lean();
            const img = await identity.find({'_id': {$ne: user_id}}).select('-_id').select('-__v').lean();

            const adress = await usr_address.find({'_id': {$ne: user_id}}).select('-_id').select('-__v').lean();
              for(let i =0; i<usr.length; i++){
                for(let j =0;j<img.length; j++){
                    if(String(usr[i]._id) == String(img[j].user)){
                        Object.assign(usr[i], img[j]);
                        console.log(usr[i])
                    }
                }
              }   


              for(let i =0; i<usr.length; i++){
                for(let j =0;j<adress.length; j++){
                    if(String(usr[i]._id) == String(adress[j].user)){
                        Object.assign(usr[i], adress[j]);
                        console.log(usr[i])
                    }
                }
              }   
 
               usr.forEach(el => delete el['_id']);
               usr.forEach(el => delete el['user']);
               usr.forEach(el => delete el['createdAt']);
               usr.forEach(el => delete el['updatedAt'])

              
              if(usr){     
                csv = json2csv(usr, {fields});
                fs.writeFile(filePath, csv, function(err){
                    if(err){
                        res.status(404).json({
                            messsage: 'file not created'
                        })
                        return
                    }
                    else{
                        setTimeout( function (){
                            fs.unlink(filePath, function(err){
                                console.log('your file has been downloaed')
                                if(err){
                                    console.error(err)
                                }
                            })
                        }, 5000);
                        res.download(filePath);
                       
                    }
                })
              }
        }
        catch(e){
                    res.status(404).json({
                        message: 'something went wrong',
                        error: e.message
                    })
                }

            }
            
          