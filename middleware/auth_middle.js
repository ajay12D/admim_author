import { identity } from '../model/image_schema.js';
import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    const token  = req.headers.token;
   
    try{
          
     const decoded_data = jwt.verify(token, process.env.jwt_secrt);

     if(decoded_data){
       req.user_id = decoded_data.user_id;
       next()
     }
     else{
       res.status(403).json({
           message: 'invalid credentials'
       })
     }
    }

    catch(e){
        res.status(404).json({
          message: 'somethibng went wrong',
          error: e.message
        })
    }

};



  export const upload_checker = async (req,res,next) => {
        const user_id = req.user_id;

          const file_prsnt = await identity.findOne({user: user_id});

          if(file_prsnt){
           console.log('user alredy uploaded')
            return
          }
          else{
            next();
          }
         
  }