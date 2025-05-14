import { Router } from "express";
import { signin, signup , add_user, send_invite, getUser, saving_details,uploadFile} from "../controller/usr_controller.js";
import { auth } from "../middleware/auth_middle.js";
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

router.post('/add_user',auth, add_user);

router.post('/invite',auth,send_invite);

router.get('/user',auth, getUser);

router.post('/img_upate',auth, saving_details);

router.post("/upload_single", upload.single("profile-files"), uploadFile);


export default router;