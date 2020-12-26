const user = require("../model/user");
const travel_listings = require("../model/travel_listings");
const jwt = require("../model/jwt");
const reviews = require("../model/review");
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const util = require("util");
const stream = require("stream");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const pipeline = util.promisify(stream.pipeline);
const fsPromises = require("fs.promises");
const app = express();
const upload = multer({dest: `upload/`,limits:{fileSize:1048576}});
const ERROR_MSG = "Internal Server Error";
const type = upload.single("upload");
const profile_pic_url = `./public/images/`
const travel_url = `./public/travel/`

const transfer = async (src,dest)=>{
    await pipeline(
        fs.createReadStream(src),
        fs.createWriteStream(dest)
    ).then(()=>{
        fs.unlink(src,()=>{});
    }
       
    );
}

app.use(type);
app.use(cors());
app.use(express.static(path.resolve("./public/")))
app.use(cookieParser())

// #region Site Routing

app.get("/getHeader", jwt.checkTokenValid, async(req, res) => {
    try{
        // let decoded = jwt.verifyToken(req.cookies.sessionCookie);
        if(req.token == null){
            res.status(200).sendFile(path.resolve("./public/signedout_header.html"));
        }else if(req.token.role == "admin"){
            res.status(200).sendFile(path.resolve("./public/admin_header.html"));
        }else{
            res.status(200).sendFile(path.resolve("./public/signedin_header.html"));
        }
    }catch(err){
        console.log(err);
        res.status(200).sendFile(path.resolve("./public/signedout_header.html"));
    }
})

app.get("/", async(req, res) => {
    try{
        res.status(200).sendFile(path.resolve("./public/index.html"));
    }catch(err){
        console.log(err);
        res.status(500).send(path.resolve("./public/error.html"));
    }
})

app.get("/travelPackages", jwt.checkTokenExists, async(req, res) => {
    try{
        res.status(200).sendFile(path.resolve("./public/travel_packages.html"));
    }catch(err){
        console.log(err);
        res.status(500).send(path.resolve("./public/error.html"));
    }
})

app.get("/view", jwt.checkTokenExists, async(req, res) => {
    try{
        res.status(200).sendFile(path.resolve("./public/listing_details.html"));
    }catch(err){
        console.log(err);
        res.status(500).send(path.resolve("./public/error.html"));
    }
})

app.get("/edit", jwt.checkAdmin,(req,res)=>{
    res.status(200).sendFile(path.resolve("./public/update_listing_details.html"))
})

app.get("/admin",jwt.checkAdmin,async(req,res)=>{
    res.status(200).sendFile(path.resolve("./public/admin_console.html"));
    // res.status(200).sendFile("/admin_console.html");
})

//#endregion

app.post("/travel/filter", async (req, res) => {
    try{
        let country = req.body.country;
        let dateFrom = req.body.dateFrom;
        let dateTo = req.body.dateTo;
        let minPrice = req.body.minPrice;
        let maxPrice = req.body.maxPrice;
        console.log(req.body)
        const results = await travel_listings.filter_travel_listings(country, dateFrom, dateTo, minPrice, maxPrice);
        res.status(200).send(results);
    }catch(err){
        console.log(err);
        res.status(500).sendFile(path.resolve("./public/error.html"));
    }
})


app.get("/users",async(req,res)=>{
    try{
        const results = await user.get_users();
        res.status(200).send(results);
    }catch(err){
        console.log(err);
        res.status(500).send(ERROR_MSG);
    }
})

app.post("/users",async (req,res)=>{
    try{
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        // const src = req.file.path;
        // const dest = `${profile_pic_url}${username}.jpg`;
        // await transfer(src,dest);
        const results = await user.add_users(username,email, "default", password);
        res.type("json").status(201).send(`{"userid":${results}}`);
    }catch(err){
        console.log(err);
        res.status(err.errno==1062?422:500).send(err.errno==1062?"Unprocessable Entity":"Internal Server Error");
    }
})

app.get("/users/:id",jwt.checkTokenExists,async(req,res)=>{
    try{
        const results = await user.get_users_by_id(req.params.id);
        res.status(200).send(results);
    }catch(err){
        console.log(err);
        res.status(500).send(ERROR_MSG);
    }
})

app.put("/users/:id",jwt.checkUserId,async(req,res)=>{
    try{
        const userid = req.params.id;
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const src = req.file.path;
        const dest = `${profile_pic_url}${username}.jpg`;
        await transfer(src,dest);
        const results = await user.update_users(userid,username,email,username, password);
        res.status(204).send();
    }catch(err){
        console.log(err);
        res.status(err.errno==1062?422:500).send(err.errno==1062?"Unprocessable Entity":"Internal Server Error");
    }
})

app.get("/travel",async(req,res)=>{
    try{
        const results = await travel_listings.get_travel_listings();
        res.status(200).send(results);
    }catch(err){
        console.log(err);
        res.status(500).send(ERROR_MSG);
    }
})

app.post("/travel",jwt.checkAdmin,async(req,res)=>{
    try{
        const title = req.body.title;
        const description = req.body.description;
        const price = req.body.price;
        const country = req.body.country;
        // const travel_period = req.body.travel_period;
        const dateFrom = req.body.date_from;
        const dateTo = req.body.date_to;
        const src = req.file.path;
        console.log(req.file);
        const dest = `${Date.now()}.jpg`;
        await transfer(src,`${travel_url}${dest}`);
        const results = await travel_listings.add_travel_listings(title,description,dest,price,country,dateFrom, dateTo);
        res.type("json").status(201).send(`{"travelid":${results}}`);
    }catch(err){
        console.log(err);
        res.status(500).send(ERROR_MSG);
    }
})

app.delete("/travel/:id/",jwt.checkAdmin, async(req, res) => {
    try{
        const tid = req.params.id;
        const travel = await travel_listings.get_travel_listings_by_id(tid);
        fs.unlink(`${travel_url}${travel[0].image_url}`,async()=>{
            const result = await travel_listings.delete_travel_listing(tid);
            res.status(204).send(null);
        });
    }catch(err){
        res.status(500).send(ERROR_MSG);
    }
})

app.put("/travel/:id/",jwt.checkAdmin, async(req, res) => {
    try{
        const tid = req.params.id;
        const title = req.body.title;
        const description = req.body.description;
        const price = req.body.price;
        const country = req.body.country;
        const date_to = req.body.date_to;
        const date_from = req.body.date_from
        console.log(tid);
        if(req.file != undefined || req.file !=null){
            const src = req.file.path;
            const dest = `${Date.now()}.jpg`;
            await transfer(src,`${travel_url}${dest}`);
            const travel = await travel_listings.get_travel_listings_by_id(tid);
            fs.unlink(`${travel_url}${travel[0].image_url}`,async()=>{
                const result = await travel_listings.update_travel_listing(title, description, price, country, date_from, date_to, tid, dest);
            });
        }
        else{
            const result = await travel_listings.update_travel_listing(title, description, price, country, date_from, date_to, tid,);
            console.log(result)
        }
        
        res.status(204).send(null);
    }catch(err){
        console.log(err)
        res.status(500).send(ERROR_MSG);
    }
})

app.get("/travel/:id/itinerary",jwt.checkTokenExists, async(req, res) => {
    try{
        const tid = req.params.id;
        const result = await travel_listings.get_initinerary(tid);
        res.status(200).send(result);
    }catch(err){
        res.status(500).send(ERROR_MSG);
    }
})

app.delete("/travel/itinerary/:iid", jwt.checkAdmin, async(req, res) => {
    try{
        const iid = req.params.iid;
        const result = await travel_listings.delete_itinerary(iid);
        console.log(result);
        res.status(204).send(null);
    }catch(err){
        console.log(err);
        res.status(500).sendFile(path.resolve("./public/error.html"));
    }
})

app.post("/travel/:id/itinerary",jwt.checkAdmin, async(req, res) => {
    try{
        const tid = req.params.id;
        const day = req.body.day;
        const activity = req.body.activity;
        const result = await travel_listings.create_itinerary(tid, day, activity);
        res.status(201).send(`{"itineraryid":${result}}`);
    }catch(err){
        console.log(err)
        res.status(500).send(ERROR_MSG);
    }
})

app.post("/travel/:tid/review",jwt.getUserId, async(req, res) => {
    try{
        const uid = req.uid;
        const tid = req.params.tid;
        const content = req.body.content;
        const rating = req.body.rating;
        const result = await reviews.create_review(uid, tid, content, rating);
        res.status(201).send(`{"reviewid":${result}}`);
    }catch(err){
        console.log(err)
        res.status(500).send(ERROR_MSG);
    }
})

app.post("/user/:uid/travel/:tid/review",jwt.checkUserId, async(req, res) => {
    try{
        const uid = req.params.uid;
        const tid = req.params.tid;
        const content = req.body.content;
        const rating = req.body.rating;
        const result = await reviews.create_review(uid, tid, content, rating);
        res.status(201).send(`{"reviewid":${result}}`);
    }catch(err){
        console.log(err)
        res.status(500).send(ERROR_MSG);
    }
})

app.get("/travel/:id/review",jwt.checkTokenExists, async(req, res) => {
    try{
        const tid = req.params.id;
        const result = await reviews.get_review(tid);
        res.status(200).send(result);
    }catch(err){
        console.log(err)
        res.status(500).send(ERROR_MSG);
    }
})


// bonus feature login
app.post("/user/login", async(req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const result = await user.login_user(email, password);
        const users = result.user
        const token = await jwt.getToken(users.userid,users.role);
        const message = users.role =="admin" ? "Welcome admin!" : result.message;
        res.cookie("sessionCookie",token,{httpOnly:true,sameSite:"lax", expires:false}).status(200).send(message);
    }catch(err){
        console.log(err)
        res.status(500).send(ERROR_MSG);
    }
})

app.post("/user/logout",(req,res) =>{
    res.clearCookie("sessionCookie").status(200).send();
})



module.exports = app;