import Joi from "joi";



export function isEmailValid(email){
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email)
}






const SPECIAL_CHARACTERS = "\\!@#$%^&*()_\\-+={}\\[\\]|:;\"'<>,.?/~`"
const MIN_LENGTH = 6



export const passwordSchema = Joi.string()
  .min(MIN_LENGTH)  // Minimum length
  .regex(/[a-z]/, 'lowercase')  // At least one lowercase letter
  // .regex(/[A-Z]/, 'uppercase')  // At least one uppercase letter
  // .regex(/[0-9]/, 'number')  // At least one number
  // .regex(new RegExp(`[${SPECIAL_CHARACTERS}]`), 'special character')  // At least one special character
  .messages({
    'string.min': `Password must be at least ${MIN_LENGTH} characters long`,
    'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
  })

// export function validatePassword(password="") {
//   console.log

//   const errors = {};
//   const err_mandatory = []

//   const hasMinimumLength = password.length>=MIN_LENGTH
//   const hasLowercase = /[a-z]/.test(password)
//   const hasUppercase = /[A-Z]/.test(password)
//   const hasNumber = /[0-9]/.test(password)
//   const hasSpecialCharacter = password.split("").some(x => SPECIAL_CHARACTERS.includes(x))


//   // Minimum 8 characters
//   if (!hasMinimumLength) {
//     errors[`MIN_LENGTH`] = MIN_LENGTH
//   }

//   // At least one lowercase letter
//   if (!hasLowercase) {
//     err_mandatory.push("LOWERCASE")
//   }

//   // At least one uppercase letter
//   // or
//   // At least one number
//   // or
//   // At least one symbol
//   if (!hasUppercase && !hasNumber && !hasSpecialCharacter) {
//     err_mandatory.push(["UPPERCASE", "NUMBER", "SYMBOL"])
//   }

//   if(err_mandatory.length>0){
//     errors.MANDATORY = err_mandatory
//   }

//   return {
//     valid: Object.keys(errors).length === 0,
//     errors,
//   }
// }
