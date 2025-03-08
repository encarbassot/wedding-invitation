


import { Router } from 'express';
import { requestTryCatch } from '../utils/requestTryCatch.js';
import { db } from '../db/db.js';
import { jwtVerify } from '../utils/jwt.js';
import { tokenChecker } from '../utils.js';
import Joi from 'joi';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();
export default router;



const deleteSchema = Joi.object({
  id: Joi.string(),
  code: Joi.string(),
}).xor("id","code")

router.post("/delete",jwtVerify(tokenChecker),validateRequest(deleteSchema) ,requestTryCatch(async (req, res) => {

  const {id,code} = req.value

  const query = id ? { id } : { code }
  
  const deletion = db.delete("invitations", query);

  return { message: "Invitation deleted successfully", deletion };
}))





const deleteMenuSchema = Joi.object({
  id: Joi.string().required()
})

router.post("/menu/delete",jwtVerify(tokenChecker), validateRequest(deleteMenuSchema), requestTryCatch(async (req, res) => {
  const {id} = req.value
  const deletion = db.delete("menus", {id})
  return deletion
}))