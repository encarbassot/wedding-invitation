


import { Router } from 'express';
import { requestTryCatch } from '../utils/requestTryCatch.js';
import { db } from '../db/db.js';
import { jwtVerify } from '../utils/jwt.js';
import { tokenChecker } from '../utils.js';
import { ERROR } from '../utils/requestManager.js';
import Joi from 'joi';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();
export default router;



const updateSchema = Joi.object({
  id: Joi.string().required(), // Required to identify which record to update
  name: Joi.string().optional().allow(""),
  leader: Joi.boolean().optional(),
  name_locked: Joi.boolean().optional(),
  menu_id: Joi.string().optional().allow(null),
  confirmed: Joi.boolean().optional().allow(null),
  // code: Joi.string().optional(), // Optional in case we need to update it
});


router.post("/update", jwtVerify(tokenChecker), validateRequest(updateSchema), requestTryCatch(async (req, res) => {

  const { id, ...updateData } = req.value;

  const updatedUser = db.update("invitations", updateData, { id });

  return updatedUser;
}));




const updateMineSchema = Joi.object({
  id: Joi.string().required(), // Required to identify which record to update
  code: Joi.string().required(), 

  name: Joi.string().optional(),
  menu_id: Joi.string().optional().allow(null),
  confirmed: Joi.boolean().optional().allow(null),
});

router.post("/update-mine",validateRequest(updateMineSchema), requestTryCatch(async (req, res) => {

  const { id, code,name, ...updateData } = req.value;
  console.log("NAME",name)

  const existingRecord = db.findOne("invitations", { id, code });

  if (!existingRecord) {
    return res.sendBad(ERROR.NOT_FOUND, "Invitation not found or invalid code.");
  }


  console.log(existingRecord.name_locked , updateData.name)
  if (!existingRecord.name_locked && name) {
    updateData.name = name;
  }

  

  console.log("update-mine", updateData);
  db.update("invitations", updateData, { id, code });


  return {...existingRecord,...updateData};
}));




const updateMenuSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  emoji: Joi.string().optional(),
})

router.post("/menu/update",jwtVerify(tokenChecker), validateRequest(updateMenuSchema), requestTryCatch(async (req, res) => {
  const {title,description,emoji,id} = req.value
  const insertion = db.update("menus", {title,description,emoji},{id})
  return insertion
}))