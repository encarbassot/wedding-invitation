


import { Router } from 'express';
import { requestTryCatch } from '../utils/requestTryCatch.js';
import { db } from '../db/db.js';
import { jwtVerify } from '../utils/jwt.js';
import { mineSchema, ObjectGroupBy, tokenChecker } from '../utils.js';
import { ERROR } from '../utils/requestManager.js';

const router = Router();
export default router;

router.post("/list", requestTryCatch(async (req, res) => {

  const data = await db.find("invitations")

  const groups = Object.values(ObjectGroupBy(data, x => x.code))

  const users = groups.map(group => group.sort((a, b) => a.leader ? -1 : 1).filter(user=>user.confirmed).map(({leader,code,id,confirmed,...user})=>({...user})))

  return users
  
}))




router.post("/list-mine",requestTryCatch(async (req, res) => {
  const {error,value} = mineSchema.validate(req.body)
  if (error) {
    return res.sendBad(ERROR.DATA_CORRUPT,error.details)
  }
  const {code} = value

  const data = await db.find("invitations",{code})

  return data

  
}))

router.post("/list-admin",jwtVerify(tokenChecker) ,requestTryCatch(async (req, res) => {

  const data = await db.find("invitations")

  return data
  
}))