// import { access } from "fs"
// import { User } from "../models/User.js"
import {c,title} from "./beautyConsole.js"

export const ERROR={
  MISSING_DATA:{
    msg:"expected field not present",
    code:400,
    error:"MISSING_DATA"
  },
  METHOD_NOT_ALLOWED:{
    msg:"Method not allowed",
    code:404,
    error:"METHOD_NOT_ALLOWED"
  },
  ALREADY_DONE:{
    msg:"Esta acción ya se ha realizado",
    code:400,
    error:"ALREADY_DONE"
  },
  DATA_CORRUPT:{
    msg:"Data is corrupt",
    code:400,
    error:"DATA_CORRUPT"
  },
  VALIDATION_ERROR:{
    // Only for "validateRequest.js" middleware
    msg: "Invalid input data",
    code: 422,
    error: "VALIDATION_ERROR",
  },
  UNAUTHORIZED:{
    msg:"you aren't authorized on this page",
    code:401,
    error:"UNAUTHORIZED"
  },
  PERMISSIONS:{
    msg:"Permission range too low",
    code:401,
    error:"PERMISSIONS"
  },
  BAD_LOGIN:{
    msg:"login not successful",
    code:400,
    error:"BAD_LOGIN"
  },
  CREDENTIALS:{
    msg:"failed to authentificate",
    code: 400,
    error:"CREDENTIALS"
  },
  PASSWORD_FORMAT:{
    msg:"password doesnt match the requirments",
    code:400,
    error:"PASSWORD_FORMAT"
  },
  DUPLICATE:{
    msg:"Duplicate data",
    code:400,
    error:"DUPLICATE"
  },
  GENERAL:{
    msg:"An error occurred",
    code:400,
    error:"GENERAL"
  },
  UNEXISTENT:{
    msg:"Data you are trying to get doesnt exist",
    code:400,
    error:"UNEXISTENT"
  },
  NO_FILE:{
    msg:"No file provided",
    code:400,
    error:"NO_FILE"
  },
  NO_FILE:{
    msg:"No file provided",
    code:400,
    error:"NO_FILE"
  },
  FILE_PROCESSING:{
    msg:"Error processing file data",
    code:500,
    error:"FILE_PROCESSING"
  },
  RATE_LIMIT: {
    msg: 'Rate limit exceeded. Please try again later.',
    code: 429, // 429 Too Many Requests
    error: 'RATE_LIMIT',
  },
  NOT_FOUND:{
    msg:'The requested resource could not be found.',
    code:404,
    error:'NOT_FOUND'
  },
  INFORMATION_DEPENDENT:{
    msg:'The operation is restricted because this record is referenced by other records.',
    code:400,
    error:'INFORMATION_DEPENDENT'
  },
  TYPE_MISMATCH:{
    msg:'Type mismatch',
    code:400,
    error:"TYPE_MISMATCH"
  },
  CONFLICT: {
    msg: "The requested action cannot be completed due to a conflict with existing data.",
    code: 409, // HTTP 409 Conflict
    error: "CONFLICT"
  }
}


function sendResOK(res,data){
  if (data === false) {
    // If data is false, we send a bad response
    return sendResBAD(res, ERROR.DATA_CORRUPT)
  }

  // if(data instanceof User){
  //   // data = data.publicData()
  // }
  if(res.cookieAccessToken){
    console.log("COOKIE")
    return res.cookie("access_token",res.cookieAccessToken,{
      httpOnly:true,//solo se puede acceder desde el servidor
      // secure:true,//solo en HTTPS
      // sameSite:"strict",
      maxAge: 1000 * 60 * 60 * 24 * 12 //12 dias
    }).json({success:true,data})
  }
  return res.json({success:true,data})
}



export function sendResBAD(res,err,more=undefined,field=null){
  if (field) {
    // Ensure err.more.fields exists
    if (!err.more) err.more = {};
    if (!err.more.fields) err.more.fields = {};

    // Assign error message to the specific field
    err.more.fields[field] = more;
  } else if (more) {
    err.more = more;
  }
  
  return res.status(err?.code || 400).json({success:false,err})
}



function catchRes(req,res,err,path){
  if(err.alreadySentResponse){
    return
  }else if(err.name === "CustomError"){
    sendResBAD(res,err.err,err.more)
    return
  }else{
    sendResBAD(res,ERROR.GENERAL)
  }

  


  
  const endpointPath = req.originalUrl || req.url
  console.log(`ERROR FILE:${path.url} ENDPOINT:${endpointPath} ERROR:${err.message}`)


  const callingFileName = new URL(import.meta.url).pathname;
  console.log(`Called from: ${callingFileName}`);

  console.log(c("r",title("ERROR")))
  console.log(c("r","FILE:"),path.url)
  console.log(c("r","ENDPOINT:"),endpointPath)
  console.error(err)  
}







function logicStringFromLogicArray(logicArray){
  function logicString(logic,level = 0){
    if(typeof(logic) === "boolean"){
      return logic?"true":"false"
    }else if(typeof(logic) === "string"){
      return logic
    }else if(Array.isArray(logic)){
      let result = "( "
      const logicGate = level%2===0?"AND":"OR"
      result += logic.map(x=>logicString(x,level+1)).join(` ${logicGate} `)
      result+=" )"
      return result
    }else{
      if(logic.type === "array"){
        return (logic.key?logic.key+":":"")+`[${logicStringFromLogicArray(logic.subtype)}]`
      }else if(logic.type==="object"){
        return (logic.key?logic.key+":":"")+`{${logicStringFromLogicArray(logic.values)}}`
      }else {
        return logic.key+":"+logic.type
      }
    }
  }
  return logicString(logicArray)
}


/**
 * Extracts and validates required data from the request body based on a logical condition.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Array|String} logic - Logical condition specifying required keys in the request body.
 * @param {Boolean} firstLevelOr - if set to true, odd levels are considered OR and even are AND
 * @throws {Error} - Throws an error if the response has already been sent.
 * @returns {Object} - Extracted and validated required data from the request body.
 * 
 * this also can be used as a <req> method as req.requireBodyData (will be funny req.uireBodyData)
 * @example
 *   const {colorName,colorHex,colorFinish} = req.requireBodyData(["colorName","colorHex","colorFinish"])
 * 
 * 
 * @example of <logic>
 * 
 * -> "username" -> username is required
 * -> ["username","password"] -> (username AND passwords) are required
 * -> [["username","email"]] -> (username OR email) is required
 * -> ["colorId",["colodName","colorHex"]] -> (colorId AND (colorName OR colorHex))
 * -> ["A",["B",["C","D"]]] -> (A AND (B OR (C AND D)))
 * 
 * checking types and more
 * -> "brandId:number" >> will check brandId to be a number
 * -> {key:"brandId",type:"number"} >> same as before
 * -> {key:"value",type:"string"}
 * -> {key:"value",type:"boolean"}
 * -> {key:"value",type:"object",values:[]} -> the array <values> is like another instance of logic array (starting with AND)
 * -> {key:"value",type:"array",subtype:"number"} -> checks if all subelements of the array are numbers
 * -> {key:"value",type:"array",subtype:"string"}
 * -> {key:"value",type:"array",subtype:"boolean"}
 * -> {key:"value",type:"array",subtype:{
 *      type:"object",
 *      values:[] -> this array is like another instance of logic array (starting with AND)
 *    }}
 * 
 * all the types declared as object also accept a function <check>
 *     {key:"name",type:"string",check:v=>v.length>0}, >>will not accept empty strings
 * 
 * // Requires 'field1' and optionaly 'field2' or 'field3'.
 * const { field1, field2, field3 } = req.requireBodyData(["field1", ["field2", "field3", true]]);
 * 
 * 
 * @example with <firstLevelOr> set to true:
 *   const { username, email } = req.requireBodyData(["username", "email"], true);
 *   // Requires either 'username' OR 'email' in the request body.
 */
function requireBodyData(req, res, logic, firstLevelOr = false) {

  const bodyData = req.body;
  const urlParams = req.query;
  
  // Combine body JSON and URL params
  const body = { ...bodyData, ...urlParams };


  function checkKeys(key,container) {
    const bodyKeys = Object.keys(container)
    if(bodyKeys.includes(key)) return true
    return false
  }

  function evaluateObject(objLogic,container){
    const { type, values, check:checkFn } = objLogic;
    if(type === "array"){
      const {subtype} = objLogic
      if(!Array.isArray(container)) return false
      if (checkFn && !checkFn(container)) return false

      if(subtype){
        if(typeof subtype === "string"){
          if(subtype === "array"){
            return container.every(subObj => Array.isArray(subObj))
          }
          return container.every(subObj => typeof subObj === subtype)
        }

        return container.every(subObj => evaluateObject(subtype,subObj))
      }


    }else if(type === "object"){
      if(typeof container !== "object" || Array.isArray(container))return false
      if (checkFn && !checkFn(container)) return false
      return evaluateLogic(values,container,0)

    }else{
      if(typeof container !== type) return false
      if (checkFn && !checkFn(container)) return false
      
    }

    return true;
  }



  function evaluateLogic(logicArray,container,level = 0) {

    //bolean operators
    if(typeof logicArray === "boolean"){
      return logicArray
    }else if (typeof logicArray === 'string'){//case base
      // Handle single key
      // Check if the single key is present in the requestData
      if(logicArray.includes(":")){
        const[key,type] = logicArray.split(":")
        return evaluateLogic({key,type},container,level)
      }
      return checkKeys(logicArray,container);

    }else if (Array.isArray(logicArray)){
      // Check if logicArray is an array

      const isAndLogic = firstLevelOr? level % 2 !== 0:level % 2 === 0; //level pair makes AND
      if(isAndLogic){
        return logicArray.every(element=>evaluateLogic(element,container,level+1))
      }else {
        return logicArray.some(element=>evaluateLogic(element,container,level+1))
      }

    }else if (typeof logicArray === 'object'){
      if(container[logicArray.key] === undefined) return false
      return evaluateObject(logicArray,container[logicArray.key])
    }
    // Invalid logic structure
    // Return false for any other unsupported logic structure
    return false;
  }



  if (!evaluateLogic(logic,body)) {
    const logicString = logicStringFromLogicArray(logic)
    sendResBAD(res, ERROR.MISSING_DATA, logicString);
    throw { alreadySentResponse: true };
  }

  //return all data available, but we know the logic is correct
  const requiredData = {}
  const keys = logic.flat(Infinity)
  for (const k of keys) {
    if(!requiredData.hasOwnProperty(k) && body.hasOwnProperty(k)){
      requiredData[k]= body[k]
    }
  }
  
  return requiredData
}






export function requestManager(){

  return (req,res,next)=>{

    res.sendBad = (...props)=>sendResBAD(res,...props) // sendResBAD(res,err,more=undefined,field=null)
    res.sendOk = (...props)=>sendResOK(res,...props) // sendResOK(res,data)
    res.catch = (err,...props)=>catchRes(req,res,err,...props) // catchRes(req,res,err,path)
    req.requireBodyData = (keys) => {
      const arg = arguments
      if(arg.length <= 1){
        return requireBodyData(req,res,keys)
      }else{
        return requireBodyData(req,res,arg)
      }
    }




    next()
  }
}










export class CustomError extends Error {
  constructor(err,_more) {
    super(err.msg);

    this.catchSendResponse = false
    this.alreadySentResponse=false

    if(typeof(_more)==="string"){
      this.more = _more
    }else if(typeof(_more)==="object"){
      const {more="",alreadySentResponse=false } = _more

      this.more = more
      this.alreadySentResponse=alreadySentResponse
    }

    this.err = err
    this.msg = err.msg
    this.code = err.code
    this.error = err.error
    this.name = 'CustomError';
    // Capture the stack trace, excluding the constructor call from it.
    Error.captureStackTrace(this, this.constructor);
  }
}















