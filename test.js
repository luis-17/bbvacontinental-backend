// console.log(encodeURI('CON TILDE CANCIÓN'));
const strEncode = Buffer.from(encodeURI('CON TILDE CANCIÓN')).toString('base64'); // encodeURI('CON TILDE CANCIÓN');
console.log(strEncode, ' strEncode');
const strDecode = decodeURI(Buffer.from(strEncode, 'base64').toString('ascii'));
console.log(strDecode);
