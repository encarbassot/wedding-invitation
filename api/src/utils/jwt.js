import jwt from "jsonwebtoken"
// import db from "../db/db.js";
// import { User } from "../models/User.js";

// import { db_getUserByJWT } from "../db/db_users.js";
// import { ERROR } from "./requestManager.js";

const JWT_TIMEOUT = process.env.JWT_TIMEOUT || "288h" //12 dias
const JWT_SECRET = process.env.JWT_SECRET || "secretJWT"


export function jwtSign(data){
  return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_TIMEOUT });
}


// export async function jwtUserFromToken(token){
//   if(!token) return undefined
//   const user = db_getUserByJWT(token)
//   if(!user) return undefined
//   return user
// }


export function unzipJWT(token){
  if (!token) return;
  const userData = jwt.verify(token, JWT_SECRET);
  return userData
}

// export async function db_getUserByJWT(token) {
//   if (!token) return;
//   const { id, iat, exp } = unzipJWT(token)
//   // console.log(new Date(iat * 1000))
//   // console.log(new Date(exp * 1000))
//   const userData = await db.findOne("users",{id})
//   // const userData = await db.query(`
//   //   SELECT 
//   //     companies.*,
//   //     users.*,
//   //     companies.id AS company_id,
//   //   FROM users
//   //   JOIN companies ON users.company = companies.company
//   //   WHERE users.id = ?
//   // `, [id])
//   const user = new User(userData)
//   return user
// }

export function jwtVerify(tokenChecker){


  return async (req, res, next) => {
    try {
      let token =
        req.body.token || req.query.token || req.headers["authorization"] || req.headers["Authorization"];
  
      if (!token) {
        return res.status(403).json({
          success: false,
          msg: "A token is required for authentication",
        });
      }
      
      if(token.startsWith("Bearer ")){
        token = token.replace("Bearer ","")
      }

      if(tokenChecker){
        const jwt = unzipJWT(token)

        const user = tokenChecker(jwt,token)
        if(!user){
          return res.status(401).json({ success: false, msg: "Invalid Token" });
        }
        req.user = user;
      }else{
        const user = await db_getUserByJWT(token);
    
        if (!user) {
          return res.status(401).json({ success: false, msg: "Invalid Token" });
        }
    
        req.user = user;
      }
      
      return next();
    } catch {
      return res.status(401).json({ success: false, msg: "Invalid Token" });
    }
  }
}



