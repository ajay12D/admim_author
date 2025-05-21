import { Router } from "express";
import { signin, signup ,
  send_invite, getUser,
   saving_details,uploadFile, user_info, puting_address, my_details, specific_user, all_users} from "../controller/usr_controller.js";
   import { csvConverter, conversion } from "../controller/csvConverion.js";
import { auth, upload_checker} from "../middleware/auth_middle.js";

import path from 'path'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${Date.now()}${ext}`); 
    }
  });

  const upload = multer({ storage });

const router = Router();
import multer from "multer";



router.post('/signup', signup);
router.post('/signin', signin);

//router.post('/add_user',auth, add_user);

router.post('/invite',auth,send_invite);

router.get('/user',auth, getUser);

router.post('/img_upate',auth, saving_details);

router.get('/user_details', auth, user_info);


router.post('/usr_address', auth, puting_address);

router.get('/me', auth, my_details);
router.post('/csv-genrater', auth,csvConverter,conversion);

router.post('/find_usr', auth, specific_user);

router.get('/all_users',auth, all_users);


export default router;
router.post("/upload_single", auth, upload_checker, upload.single("profile-files"), uploadFile);