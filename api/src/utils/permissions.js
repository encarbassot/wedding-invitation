import { ERROR } from "./requestManager.js"

export const PERMISSIONS={
  SUPER:5,
  ADMIN:3,
  USER:0
}



// makes sure the user is requesting has the permisions to access the route
export function permissions(minLevel){
  return (req,res,next)=>{


    if(!req.user){
      return res.sendBad(ERROR.CREDENTIALS)
    }

    if(req.user.permissions < minLevel){
      return res.sendBad(ERROR.UNAUTHORIZED)
    }

    next()

  }
}




export function getRolesEqualOrLower(role){

  const roleLevel = PERMISSIONS[role.toUpperCase()] || PERMISSIONS.USER

  return Object.keys(PERMISSIONS).filter(r=>PERMISSIONS[r] <= roleLevel).map(r=>r.toLowerCase())

}