import CryptoJS from 'crypto-js';

const SECRET_KEY = 'secret'; // Store this in environment variables

const offset = 3;

export const encryptData = (text) =>  {
  // Encrypt by shifting characters by the offset
  return Array.from(text)
    .map(char => String.fromCharCode(char.charCodeAt(0) + offset))
    .join('');
}

export const decryptData = (encryptedText) =>{
  // Decrypt by reversing the shift
  return Array.from(encryptedText)
    .map(char => String.fromCharCode(char.charCodeAt(0) - offset))
    .join('');
}


export const encryptData2 = (data) => {
  const dataString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();
};

export const decryptData2 = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    return null;
  }
};

export const compare = (data, encryptedData) => {
  // const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  // const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  const decryptedString = decryptData(encryptedData);

  return data === decryptedString;
};

