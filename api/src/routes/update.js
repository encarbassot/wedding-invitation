


import { Router } from 'express';
import { requestTryCatch } from '../utils/requestTryCatch.js';
import { db } from '../db/db.js';
import { jwtVerify } from '../utils/jwt.js';
import { tokenChecker } from '../utils.js';
import { ERROR } from '../utils/requestManager.js';
import Joi from 'joi';

const router = Router();
export default router;



const updateSchema = Joi.object({
  id: Joi.string().required(), // Required to identify which record to update
  name: Joi.string().optional(),
  leader: Joi.boolean().optional(),
  name_locked: Joi.boolean().optional(),
  menu_id: Joi.string().optional().allow(null),
  confirmed: Joi.boolean().optional(),
  // code: Joi.string().optional(), // Optional in case we need to update it
});


router.post("/update", jwtVerify(tokenChecker), requestTryCatch(async (req, res) => {
  const { error, value } = updateSchema.validate(req.body);

  if (error) {
    return res.sendBad(ERROR.DATA_CORRUPT, error.details);
  }

  const { id, ...updateData } = value;

  // Ensure the record exists before updating
  const existingRecord = db.findOne("invitations", { id });
  if (!existingRecord) {
    return res.sendBad(ERROR.NOT_FOUND, "Invitation not found");
  }

  // Prepare the updated object
  const updatedUser = {
    ...existingRecord,
    ...updateData,
    updated_at: new Date().toISOString(),
  };

  console.log("update", updatedUser);
  db.update("invitations", updatedUser, { id });

  return updatedUser;
}));




const updateMineSchema = Joi.object({
  id: Joi.string().required(), // Required to identify which record to update
  code: Joi.string().required(), 

  name: Joi.string().optional(),
  menu_id: Joi.string().optional().allow(null),
  confirmed: Joi.boolean().optional(),
});

router.post("/update-mine", requestTryCatch(async (req, res) => {
  const { error, value } = updateMineSchema.validate(req.body);

  if (error) {
    return res.sendBad(ERROR.DATA_CORRUPT, error.details);
  }

  const { id, code, ...updateData } = value;

  const existingRecord = db.findOne("invitations", { id, code });

  if (!existingRecord) {
    return res.sendBad(ERROR.NOT_FOUND, "Invitation not found or invalid code.");
  }

  // Prevent name change if name_locked is true
  if (existingRecord.name_locked && updateData.name) {
    return res.sendBad(ERROR.UNAUTHORIZED, "You cannot change your name.");
  }

  // Merge existing record with allowed updates
  const updatedUser = {
    ...existingRecord,
    ...updateData,
    updated_at: new Date().toISOString(),
  };

  console.log("update-mine", updatedUser);
  db.update("invitations", updatedUser, { id, code });


  return updatedUser;
}));
