import Joi from 'joi';

import { Router } from 'express';
import  {requestTryCatch} from "../utils/requestTryCatch.js";
import { ERROR } from '../utils/requestManager.js';
import { jwtSign } from '../utils/jwt.js';

const router = Router();
export default router;

const p = process.env.PASSWORD 
const id = process.env.ID

const schema = Joi.object({
  password: Joi.string().min(6).required()
})

router.post("/login", requestTryCatch(async (req, res) => {


  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.sendBad(ERROR.DATA_CORRUPT,error.details)
  }

  console.log("LOGIN",value)

  const { password } = value

  if (password !== p) return false

  const token = jwtSign({ id })

  return token
  
}))