import Joi from 'joi';

import { Router } from 'express';
import  {requestTryCatch} from "../utils/requestTryCatch.js";
import { ERROR } from '../utils/requestManager.js';
import { jwtSign } from '../utils/jwt.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();
export default router;

const p = process.env.PASSWORD 
const id = process.env.ID

const schema = Joi.object({
  password: Joi.string().min(6).required()
})

router.post("/login", validateRequest(schema),requestTryCatch(async (req, res) => {


  const { password } = req.value

  console.log("LOGIN",password)


  if (password !== p) return res.sendBad(ERROR.UNAUTHORIZED,"Invalid password","password")

  const token = jwtSign({ id })

  return token
  
}))