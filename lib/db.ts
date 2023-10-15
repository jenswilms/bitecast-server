export function generateID(name: string) {
  const crypto = require('crypto');
  const date = new Date().toISOString();
  const hash = crypto.createHash('md5').update(name + date).digest('hex');
  return hash;
}

export function getProfile() {
  // Code for getting profile goes here

  

}

export function storeProfile() {
  // Code for storing profile goes here
}


