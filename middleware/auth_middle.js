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

}