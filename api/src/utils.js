import Joi from "joi";

const ID = process.env.ID

export function tokenChecker({id}){
  if(id === ID){
    return {
      success:true
    }
  }
}





export function ObjectGroupBy(arrayOfObjects, fallbackFunction) {
  if (typeof Object.groupBy === "function") {
    return Object.groupBy(arrayOfObjects, fallbackFunction);
  }

  return arrayOfObjects.reduce((acc, obj) => {
    const key = fallbackFunction(obj);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}



export const mineSchema = Joi.object({
  code: Joi.string().required()
})





export function generateAlphanumericCode(length=6,charset="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
  let result = "";
  const charsetLength = charset.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    result += charset[randomIndex];
  }

  return result;
}