import { User } from "../model/usr_schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import fs from 'fs/promises';
import path from 'path'
import { identity } from "../model/image_schema.js";
import { error } from "console";
import multer from "multer";



const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 25,
    secure: false, 
    auth: {
      user: "5818e2d09c1e77",
      pass: "3af726ca5a3266",
    },
  });

export const signup = async (req,res) => {

    const email = req.body.email;
    const {password} = req.body;
    const {username} = req.body;
    const {is_admin} = req.body;

    try{
         const hased_password = await bcrypt.hash(password, 7);

       const usr =    await User.create({
            email: email,
            password: hased_password,
            username:username,
            is_admin:is_admin

           })
        
           if(usr){
            res.status(200).json({
                message: 'user signupn successfully'
            })
            return
            
           }

           else{
            res.status(404).json({
                message: 'invalid input'
            })
           }
    }

    catch(e){
        res.status(404).json({
            message: 'somthing went wrong',
            erro:e.message
        })
    }


}


export const signin = async (req,res) => {
        const {email} = req.body;
        const {password} = req.body;   
      
       try{
        let token;
        const usr = await User.findOne({email: email});
        console.log(usr)
         if(usr){
            const c_result = await bcrypt.compare(password, usr.password);
            if(c_result){
                token = jwt.sign({user_id: usr._id}, process.env.jwt_secrt, {
                    expiresIn: '5h'
                })

            }
            if(token){
                res.status(200).json({
                    message: 'user sign in',
                    token
                })
                return
            }
            else{
                res.status(403).json({
                    message: 'invalid credentials'
                })
            }
         }
       }
       catch(e){
        res.status(404).json({
            message: 'somthing went wrong',
            erro:e.message
        })
       }

};




export const saving_details = async (req,res) => {

    const {user_id} = req;
    const {img_url} = req.body

    try{
        const usr = await User.findById({_id:user_id});
        if(usr){
      const img = await identity.create({
        Image:img_url,
        user: user_id
      })

       if(img){
        res.status(200).json({
          message:'image updated'
        })
        return
       }
       else{
        res.status(404).json({
            message:'invalid_input'
          })
          return
       }
        }
    }
    catch(e){
        res.status(404).json({
            message:'invalid_input'
          })
    }
}

 export const getUser = async(req,res) => {
          const {user_id} = req;

          try{
            const usr = await User.findById({_id:user_id});
             if(usr){
                res.status(200).json({
                    usr
                })
                return
             }
             else{
                res.status(403).json({
                    message: 'invalid_credentials'
                })
                return
             }
          }
          catch(e){
                 res.status(404).json({
                    message: 'something went wrong',
                    error: e.message
                 })
          }
 }
export const uploadFile= (re,res)=>{
    res.status(200).json({
       message: 'file successfully uploaded'
    })
}


export const add_user = async (req,res) => {
    
    const {user_id} = req;
    const {email} = req.body;
    const {password} = req.body;
    const {username} = req.body;

    try{

        const admin = await User.findById(user_id);
        if(!admin.is_admin == true){
          res.status(403).json({
            message: 'only admin have the access to create user'
          })
        }

         const hased_password = await bcrypt.hash(password, 7);

       const usr =    await User.create({
            email: email,
            password: hased_password,
            username:username,
            is_admin:is_admin

           })

           if(usr){
            res.status(200).json({
                message: 'user signupn successfully'
            })
            return
           }

           else{
            res.status(404).json({
                message: 'invalid input'
            })
       }
    }
    catch(e){
        res.status(404).json({
            message: 'somthing went wrong',
            error:e.message
    })
}

};

export const send_invite = async (req, res) => {
    const {user_id} = req;
  try{
    const admin = await User.findById(user_id);
    if(!admin.is_admin == true){
      res.status(403).json({
        message: 'only admin have the access to invite user'
      })
    }
     


    let mailDetails = {
        from: 'ajay@gmail.com',
        to: 'randomUser@gmail.com',
        subject: 'sign up user',
        text: 'tetsing signup functionalty',
        html: `<a href = http://localhost:5173/signup>signup</a>`
    };
    
    
    transporter.sendMail(mailDetails,
            function (err, data) {
                if (err) {
                    console.log('Error Occurs');
                } else {
                    console.log('Email sent successfully');
                }
            });
            return res.status(200).json({
                message: 'user invited'
            })
  }
   catch(e){
       res.status(404).json({
        message: 'somthing went wrong',
        error: e.message
       })
   }

        

}



