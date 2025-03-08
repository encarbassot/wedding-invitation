


import { Router } from 'express';
import { requestTryCatch } from '../utils/requestTryCatch.js';
import { db } from '../db/db.js';
import { jwtVerify } from '../utils/jwt.js';
import { mineSchema, ObjectGroupBy, tokenChecker } from '../utils.js';
import { ERROR } from '../utils/requestManager.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();
export default router;

router.post("/list", requestTryCatch(async (req, res) => {

  const data = await db.find("invitations")
  let total = data.length
  const assistants = data.filter(d => d.confirmed)


  return {
    assistants:assistants.map(({id,code,leader,name_locked,...user})=>user),
    total
  }
  
}))




router.post("/list-mine",validateRequest(mineSchema),requestTryCatch(async (req, res) => {
  
  const {code} = req.value

  const data = await db.find("invitations",{code})

  if(data.length === 0) return false

  return data

  
}))

router.post("/list-admin",jwtVerify(tokenChecker) ,requestTryCatch(async (req, res) => {

  const data = await db.find("invitations")

  return data
  
}))

















router.post("/menus/list-admin",jwtVerify(tokenChecker), requestTryCatch(async (req, res) => {
  
  const data = db.find("menus")

  return data
}))

router.post("/menus/list", requestTryCatch(async (req, res) => {
  const data = db.find("menus")
  return data
}))