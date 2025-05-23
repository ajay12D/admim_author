import { User } from "../model/usr_schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import * as url from 'url';
import { error } from "console";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import fs from 'fs/promises';
import path from 'path'
import { identity } from "../model/image_schema.js";
import multer from "multer";
import { usr_address } from "../model/address_schema.js";
import { Otp } from "../model/otp_schema.js";





export const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 25,
    secure: false, 
    auth: {
      user: "5818e2d09c1e77",
      pass: "3af726ca5a3266",
    },
  });

export const signup = async (req,res) => {

    const {email} = req.body;
    const {password} = req.body;
    const {username} = req.body;
    const {is_admin} = req.body;
    const {otp} = req.body



    try{

        const otps =  await Otp.find({ email: email});
        if(otps.length ==0){
            res.status(403).json({
                message: 'invalid otp'
            })
            return
        };
        const filterOtp = otps.filter(o => o.name == "regiter_otp");
        const myOtp = filterOtp[filterOtp.length-1];

        const hasedOtp = myOtp.otp;
        const vaildOtp = await bcrypt.compare(otp, hasedOtp);
           if(vaildOtp){
            const hased_password = await bcrypt.hash(password, 7);
            const usr =    await User.create({
                email: email,
                password: hased_password,
                username: username,
                is_admin:(!!is_admin)
    
               });

               await Otp.deleteMany({email: myOtp.email});
               
            
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
           else{
                 res.status(200).json({
                    message: "invalid_otp",
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
                })

            }
            if(token){
                res.status(200).json({
                    message: 'user sign in',
                    token
                })
                return
                expiresIn: '5h'
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
            let add
            const usr = await User.findById({_id:user_id});
            if(!usr.is_admin){
                const address = await usr_address.findOne({user:user_id});
                if(!address.address){
                    add = false
                }
                else{
                 add = true
                }
              if(usr){
                 res.status(200).json({
                     usr:usr,
                     add
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
            else{
              if(usr){
                 res.status(200).json({
                     usr:usr,
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
           
          }
          catch(e){
                 res.status(404).json({
                    message: 'something went wrong',
                    error: e.message
                 })
          }
 }
export const uploadFile= async (req,res)=>{
    const {user_id} = req;
    const image = req.file.filename

     
      const file = await identity.create({
              image: image,
              user:user_id
      });
      if(file){
        res.status(200).json({
            message: 'file successfully uploaded',
            file
         })
         return
      }
      else{
            res.status(403).json({
                message:" invlid_credentials"
            })
      }
   
;}







 export const user_info = async (req,res) =>{
    const {user_id} = req;

    try{
        const file = await identity.findOne({user: user_id})

         if(file){
            res.status(200).json({
                message: 'getting the image',
                file
            })
         }
         else{
               res.status(403).json({
                message: 'invalid_input'
               })
         }
    }
    catch(e){
        res.status(404).json({      
            message: 'somthng went wrong',
            error: e.message
        })
    }
 }

export const update_img = async (req,res) => {
    
    const {user_id} = req;
    const {image} = req.file.filename

     const file = await identity.findByIdAndUpdate(user_id, {image: image});

     if(img){
        res.status(200).json({
            message: 'user updated the image',
            file
        })
     }
     else{
        res.status(200).json({
            message: 'invalid_credentials'
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


export const puting_address = async (req,res) => {
    const {user_id} = req;
    const {address} = req.body;
    try{
        const usr = await usr_address.create({
             address: address,
                user: user_id
        })
        if(usr){
          res.status(200).json({
            message: 'usr adress added',
            address
          })
        }
    }
    catch(e){
         res.status(404).json({
            message: 'somthing went wrong',
            error: e.message
         })
    }
}

export const my_details =async (req,res) => {

        const {user_id} = req;
        try{
            const usr = await User.findById(user_id);
            if(usr){
                const img = await identity.findOne({user: user_id});
                if(img){
                    const addrs = await usr_address.findOne({user: user_id});
                    if(img){
                        res.status(200).json({
                            message: 'yes user fetched successfully',
                            user:usr,
                            image:img,
                            address: addrs

                        })
                    }
                    else{
                        res.status(403).json({
                            message: 'inavalid credentails'
                        })
                    }
                }
            }
            }
        catch(e){
            res.status(403).json({
                messsage: 'something went wrong',
                error: e.message
            })  
        }
}


     export const specific_user = async (req, res) => {
        const {username} = req.body;

     try{
         
        const user = await User.findOne({username:username});
        const usr = await usr_address.findOne({user: user._id});
          if(user){
            res.status(200).json({
                message: 'gheting the user',
                user,
                address: usr.address
            })
          }
          else{
             res.status(403).json({
                message: "user not foundd",
                user

             })
          }
     }
      catch(e){
        res.status(500).json({
            message: "somthing went wrong",
            error: e.message
        })  
      }
     }


     export const all_users = async (req, res) => {
        const {user_id} = req;
        try{
            
            const data = await usr_address.aggregate([
                {
                    $lookup:{
                        from: "users",
                        localField:"user",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                }
            ]);

            if(data){
                  
                res.status(200).json({
                    message: 'user found succesfully',
                    data,
                })
            }
            else{   
                res.status(403).json({
                    message: 'user found succesfully',
                    error: 'invalid credentials'
                })
            }
        }
        catch(e){
            res.status(500).json({
                message: 'internal error',
                error:    e.message
            })
        }
     }