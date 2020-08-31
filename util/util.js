var db=require('../models');
var User=db.users;
var bcrypt=require('bcrypt');
var passwordValidator = require('validate-password');

var options={
    enforce:{
        lowercase:true,
        uppercase:false,
        specialCharacters:false,
        numbers:true,
    }
}


var passwordMessage='';
var validator = new passwordValidator(options);

const checkPasswordValidation=(password)=>{

    var passwordData=validator.checkPassword(password);
    if(!passwordData.isValid){
        passwordMessage=passwordData.validationMessage;
        console.log(passwordData.validationMessage);
    }
    return passwordData.isValid;
};

const checkUsernameValidation=async (username)=>{
    console.log('inside login validation');
    const _username=await User.count({
        where:{username:username}
    });
    if(_username==0){
        return true
    }else{
        return false
    }
    console.log('username',_username);
}

const checkEmailValidation= async (email)=>{
    console.log('inside email validation');
    const _user = await User.count({where: {email}})
    console.log('count', _user)
    if (_user == 0){
        return true
    } else{
        return false
    }
}

const validPass=(password,comPassword)=>{
    const result=bcrypt.compareSync(password,comPassword);
    return result;
}

const hashPassword=(password)=>{
    const salt=bcrypt.genSaltSync();
    const hash=bcrypt.hashSync(password,salt);
    return hash;
}
module.exports= {
    validPass,
    hashPassword,
    checkEmailValidation,
    checkUsernameValidation,
    checkPasswordValidation,
    passwordMessage
}