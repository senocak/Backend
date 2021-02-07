module.exports.MESAJ = {
    OK: {
        CODE: 200,
        MESAJ: {"mesaj": 'OK'}
    },
    CREATED: {
        CODE: 201,
        MESAJ: {"mesaj": 'Kayıt Eklendi.'}
    },
    BAD_REQUEST: {
        CODE: 400,
        MESAJ: {"mesaj": 'Geçersiz İstek2'}
    },
    UNAUTHORIZED: {
        CODE: 401,
        MESAJ: {"mesaj": 'UNAUTHORIZEDD'}
    },
    FORBIDDEN: {
        CODE: 403,
        MESAJ: {"mesaj": 'Forbiddenn'}
    },
    NOT_FOUND: {
        CODE: 404,
        MESAJ: {"mesaj": 'Kayıt Bulunamadı2'}
    }
}
module.exports.isEmailValid = function isEmailValid(email) {
    const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!email || email.length>254 || !emailRegex.test(email))
        return false;
    const parts = email.split("@");
    if(parts[0].length>64)
        return false;

    const domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    return true;
}
module.exports.isValidObjectID = function isValidObjectID(str) {
    str = str + '';
    var len = str.length, valid = false;
    if (len == 12 || len == 24) {
      valid = /^[0-9a-fA-F]+$/.test(str);
    }
    return valid;
}
module.exports.url = function(string){
    var letters = { "İ": "i", "I": "i", "Ş": "s", "Ğ": "g", "Ü": "u", "Ö": "o", "Ç": "c" }
    string = string.replace(/(([İIŞĞÜÇÖ]))+/g, function(letter){ return letters[letter] })
    string = string.replace(/ /g, "-").replace('/?/g', "-").replace(/!/g, "-").replace(/&/g, "-").replace(/%/g, "-").replace(/'/g, "-").replace(/:/g, "-")
    return string.toLowerCase()
}