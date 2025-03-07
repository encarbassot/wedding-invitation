import crypto from "node:crypto"

export const CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export const CHARSET_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


// Function to generate a secure random salt
export function generateSalt(length = 16) {
  return crypto.randomBytes(length).toString('hex')
}

// Function to hash a password with a unique salt
export function hashPassword(password,salt = undefined) {

  if(salt===undefined){
    salt = generateSalt()
  }
  const iterations = 10000
  const keylen = 64
  const digest = 'sha512'

  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)
  const hashedPwd = hash.toString('hex')
  return {salt, hash: hashedPwd}
}


// Function to verify a password
export function verifyPassword(storedHash, storedSalt, inputPassword) {
  const { hash: inputHash } = hashPassword(inputPassword, storedSalt);
  return storedHash === inputHash;
}

// // Example usage
// const { salt, hash } = hashPassword("hello");
// console.log(salt, hash);
// const ok = verifyPassword(hash, salt, "hello");
// console.log("OK,", ok);








//GENERATE PAIR
export function generateKeyPair(){
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  
  
  return [publicKey,privateKey]
}


// CLIENT FUNCTION TO ENCRYPT
export function encryptMessage(message,publicKey) {
  const buffer = Buffer.from(message, 'utf-8')
  const encrypted = crypto.publicEncrypt(publicKey, buffer)
  return encrypted.toString('base64')
}


export function decryptMessage(encryptedMessage,privateKey) {
  const buffer = Buffer.from(encryptedMessage, 'base64');
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString('utf-8');
}







export function generateRandomString(length) {
  return crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, length);
}



















export function generateAlphaNumeric(length = 8,charset=CHARSET_UPPER){

  const codeArray = Array.from({ length }, () => {
    const randomIndex = Math.floor(Math.random() * charset.length);
    return charset[randomIndex];
  });

  return codeArray.join("");
  
}

export function generateAlphaNumericNonRepeated(length=8,existingCodes=[],codeGetter=undefined,trysAddChar=-1,charset=CHARSET_UPPER){
  let chars = length
  let code;
  let count = 0

  function checkIfExists(c){
    if(codeGetter === undefined){
      return existingCodes.includes(c)
    }else if(typeof codeGetter === "function"){
      return existingCodes.some(x=>codeGetter(x) === c)
    }
  }
  
  do {
    count ++
    if(trysAddChar > 0){
      if(count>trysAddChar){
        count = 0
        chars ++
      }
    }
    code = generateAlphaNumeric(chars,charset)
  } while (checkIfExists(code))
  return code;
}










export function obfuscateEmail(email){
  const [name,domain] = email.split("@")
  return `${name.slice(0,2)}...${name.slice(-2)}@${domain}`
}