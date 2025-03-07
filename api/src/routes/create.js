


import { Router } from 'express';
import { requestTryCatch } from '../utils/requestTryCatch.js';
import { db } from '../db/db.js';
import { jwtVerify } from '../utils/jwt.js';
import { tokenChecker } from '../utils.js';
import { ERROR } from '../utils/requestManager.js';
import Joi from 'joi';

const router = Router();
export default router;



const createSchema = Joi.object({
  code: Joi.string().optional(),
  name: Joi.string().required(),
  leader: Joi.boolean().default(false),
  name_locked: Joi.boolean().default(false),
  menu_id: Joi.string().optional().default(null),
  confirmed: Joi.boolean().default(false),
})

router.post("/create",jwtVerify(tokenChecker) ,requestTryCatch(async (req, res) => {

  const {error,value} = createSchema.validate(req.body)
  if (error) {
    return res.sendBad(ERROR.DATA_CORRUPT,error.details)
  }

  const {name,leader,name_locked,menu_id,confirmed} = value
  const newUser = {
    name,
    leader,
    name_locked,
    menu_id,
    confirmed,
    code : value.code ? value.code : generateAlphanumericCode(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  console.log("create", newUser)
  db.insert("invitations",newUser)

  return newUser  
}))