const createTokenUser =(user)=>{
    return {name:user.name ,userId : user._id,role:user.role,image:user.image, eamil: user.eamil, location: user.location, phone: user.phone}
}

module.exports=createTokenUser;