import otpGenrator from "otp-generator";
import bcrypt from "bcryptjs";
import { Otp } from "../model/otp_schema.js";
import nodemailer from "nodemailer";

export const send_otp = async (req, res) => {
try{
       
    const otp = otpGenrator.generate(4, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    const  hasedOtp =  await bcrypt.hash(otp, 11);

   const otpDetails =  await Otp.create({
      email: req.body.email,
      name: "regiter_otp",
      otp:hasedOtp
     });
      
     if(otpDetails){
      console.log(`otp is submittied`)
     }

const transporter =  nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 25,
  secure: false,
  auth:{
      user: "5818e2d09c1e77",
      pass: "3af726ca5a3266",
  }
}); 

const mailOptions = {
    from: "yourOtpServing@gmail.com",
    to:  req.body.email,
    subject: 'Verification',
    html: `<p>Your Otp is ${otp}</p>`   
};

transporter.sendMail(mailOptions, function(err,data){
  if(err){
      console.error(err);
      return
  }
});

res.status(200).json({
  message: 'register otp send succcessfully'
})
}
catch(e){
    res.status(500).json({
        message: 'something went wrong',
        error: e.message
    })
}

}