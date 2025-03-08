import Joi from "joi";
import { ERROR } from "../utils/requestManager.js";

export function validateRequest(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const objResponse = {
        fields: {},
        more: error._original // This includes the original invalid input data
      };

      error.details.forEach(detail => {
        objResponse.fields[detail.path.join(".")] = detail.message;
      });

      return res.sendBad(ERROR.VALIDATION_ERROR, objResponse);
    }

    req.value = value;
    next();
  };
}