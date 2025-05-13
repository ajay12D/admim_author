import { Router } from "express";
import { signin, signup , add_user, send_invite} from "../controller/usr_controller.js";
import { auth } from "../middleware/auth_middle.js";

const router = Router();


router.post('/signup', signup);
router.post('/signin', signin);

router.post('/add_user',auth, add_user);

router.post('/invite',auth,send_invite);

export default router;