


import { Router } from 'express';
import { requestTryCatch } from '../utils/requestTryCatch.js';
import { db } from '../db/db.js';
import { jwtVerify } from '../utils/jwt.js';
import { generateAlphanumericCode, tokenChecker } from '../utils.js';
import { ERROR } from '../utils/requestManager.js';
import Joi from 'joi';
import { validateRequest } from '../middleware/validateRequest.js';

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




const createInvitationSchema = Joi.object({
  name: Joi.string().required(),
  number: Joi.number().min(1).max(20).required(),
})

router.post("/create-invitation",jwtVerify(tokenChecker), validateRequest(createInvitationSchema) ,requestTryCatch(async (req, res) => {

  const {name,number} = req.value

  const code =  generateAlphanumericCode()
  const invitations = [{
    name,
    leader:true,
    name_locked:true,
    code
  }]

  for(let i=0;i<number-1;i++){
    const dummyUser = {code}
    invitations.push(dummyUser)
  }

  const insertion = db.insert("invitations",invitations)
  return insertion
}))



const addToInvitationSchema = Joi.object({
  code: Joi.string().required()
})

router.post("/add-to-invitation",jwtVerify(tokenChecker), validateRequest(addToInvitationSchema) ,requestTryCatch(async (req, res) => {
  const {code} = req.value
  const insertion = db.insert("invitations",{code})
  return insertion
}))





const createMenuSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  emoji: Joi.string().required(),
})

router.post("/menu/create",jwtVerify(tokenChecker), validateRequest(createMenuSchema), requestTryCatch(async (req, res) => {
  const {title,description,emoji} = req.value
  const insertion = db.insert("menus", {title,description,emoji})
  return insertion
}))