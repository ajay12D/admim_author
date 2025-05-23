import {Router} from "express";
import { send_otp } from "../controller/otp_controller.js";

const router = Router();
router.post('/send_otp', send_otp);



export default router;

