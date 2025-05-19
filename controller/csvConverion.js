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
import * as aspose from "aspose.cells";

import { transporter} from "./usr_controller.js"

export const csvConverter = async (req,res,next) => {
  const {user_id} = req;

    const dateTime = Date.now();

    const filePath = path.join(__dirname, '../public', `${dateTime}.csv`);
    console.log('file path is', filePath)

  let csv;
    const fields = [ 'email', 'username', 'is_admin','image', 'address' ,];


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

              console.log(usr)
              if(usr){     
                csv = json2csv(usr, {fields});
                console.log(filePath)
                  await fs.writeFile(filePath, csv,)
                   
                  req.filePath = filePath
                  next();         
                }
            }
            
                
              catch(e){
                res.status(404).json({ 
                    message: 'something went wrong',
                    error: e.message
                })
            
            }


        }
        
      

            
            
          
            export const conversion = async (req,res) => {
               console.log('cobersion is called')
                const {filePath} = req
                //new aspose.License().setLicense('License.lic');
           
                console.log(aspose.LoadFormat.CSV);
                let loadOptions = new aspose.LoadOptions(aspose.LoadFormat.CSV);
           
                let csvWb =  new aspose.Workbook(filePath, loadOptions);
           
                let opts = new aspose.PdfSaveOptions();
           
                csvWb.getWorksheets().get(0).getPageSetup().setPrintGridlines(true);
           
                csvWb.save("./public/outputfile.pdf", opts);
                transporter.sendMail({
                  from: 'ajay@gmail.com',
                  to: 'bar@foo.com',
                  subject: 'user infomation pdf',
                  text: 'pdf file',
                  attachments: [{
                    filename: 'file.pdf',
                    path: './public/outputfile.pdf',
                    contentType: 'application/pdf'
                  }],
                  function(err, info) {
                    if (err) {
                      console.error(err);
                    } else {
                      console.log(info);
                    }
                  }
                });
                 res.status(200).json({
                    message: 'pdf created successfully and send to the user'
                 })
           
           
                   console.log('Csv to pdf conversion performed');
           }