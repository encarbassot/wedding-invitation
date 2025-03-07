


import { Router } from 'express';
import { requestTryCatch } from '../utils/requestTryCatch.js';
import { db } from '../db/db.js';
import { jwtVerify } from '../utils/jwt.js';
import { tokenChecker } from '../utils.js';
import { ERROR } from '../utils/requestManager.js';
import Joi from 'joi';

const router = Router();
export default router;



const deleteSchema = Joi.object({
  id: Joi.string().required()
})

router.post("/delete",jwtVerify(tokenChecker) ,requestTryCatch(async (req, res) => {

  const {error,value} = deleteSchema.validate(req.body)
  if (error) {
    return res.sendBad(ERROR.DATA_CORRUPT,error.details)
  }

  const {id} = value

  // Ensure the record exists before deleting
  const existingRecord = db.findOne("invitations", { id });

  if (!existingRecord) {
    return res.sendBad(ERROR.NOT_FOUND, "Invitation not found.");
  }

  // Delete the record
  db.delete("invitations", { id });

  console.log("delete", id);
  return { message: "Invitation deleted successfully", id, invitation: existingRecord };
}))