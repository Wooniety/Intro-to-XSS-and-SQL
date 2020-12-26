const jwt  = require("jwt-promise");
const secret = "Es8T7yTk2VG1szit"

const getToken  = async(userid,role)=>{
    const date = Math.floor(Date.now() / 1000);
    const token = await jwt.sign({
        "userid": userid,
        "role": role,
    },secret,{algorithm:"HS512",expiresIn: "1d"});
    return token;
}

const verifyToken = async(token)=>{
    const decoded = await jwt.verify(token,secret);
    return decoded
}

const refreshToken = async(decoded,res)=>{
    const token = await getToken(decoded.userid,decoded.role);
    res.cookie("sessionCookie",token,{httpOnly:true,sameSite:"lax"});
}


const checkTokenExists = async (req,res,next)=>{
    try{
        const decoded = await verifyToken(req.cookies.sessionCookie);
        next()
    }catch(err){
        // console.log(err.name);
        if(err.name == "TokenExpiredError"){
            res.clearCookie("sessionCookie").status(200).redirect("/");
        }
        // change the website ltr
        res.status(302).redirect("/");
    }
}

// for checking of nav header to send
const checkTokenValid = async(req, res, next) => {
    try{
        let decoded = await verifyToken(req.cookies.sessionCookie);
        req.token = decoded;
        next();
    }catch(err){
        if(err.name == "TokenExpiredError"){
            res.clearCookie("sessionCookie").status(200).redirect("/");
        }
        req.token = null;
        next();
    }
}

const checkAdmin = async (req,res,next)=>{
    try{
        const decoded = await verifyToken(req.cookies.sessionCookie);
        refreshToken(decoded,res);
        if(decoded.role =="admin"){
            next()
        }
        else{
            throw Error("Unauthorized!")
        }
    }catch(err){
        // change the website ltr
        res.status(400).send("Unauthorized!")
    }
}

const getUserId = async(req, res, next) => {
    try{
        const decoded = await verifyToken(req.cookies.sessionCookie);
        req.uid = decoded.userid;
        next();
    }catch{
        res.status(400).send("Error!");
    }
}

const checkUserId = async (req,res,next)=>{
    try{
        const decoded = await verifyToken(req.cookies.sessionCookie);
        if(decoded.userid == req.params.id){
            next()
        }
        else if(decoded.userid == req.params.uid){
            next()
        }
        else{
            res.status(400).send("Unauthorized!")
        }

    }catch{
        // change the website ltr
        res.status(400).send("Unauthorized!")
    }
}
module.exports={
    "getToken": getToken,
    "checkTokenExists":checkTokenExists,
    "checkAdmin":checkAdmin,
    "checkUserId": checkUserId,
    "checkTokenValid": checkTokenValid,
    "getUserId": getUserId
}
