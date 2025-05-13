import { User } from "../model/usr_schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'


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
    const {is_admin} = req.body

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
        html:`<a href = http://localhost:3000/>signup</a>`
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
        message: 'somthing went wrong'
       })
   }

        

}



