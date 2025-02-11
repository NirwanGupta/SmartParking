const createTokenUser =(user)=>{
    return {name:user.name ,userId : user._id,role:user.role,image:user.image, email: user.email, location: user.location, phone: user.phone}
}

module.exports=createTokenUser;