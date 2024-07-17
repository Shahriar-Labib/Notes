const express = require("express");
const app = express();
const port = 8000;
const users = require("./note.json")
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/checking-data").
then(() => console.log("MongoDB Connected")).catch((e) => console.log("mongoDB not Connected", e));


const userData = new mongoose.Schema({
    first_Name:{
        type: String,
        required: true,
    },
    Last_Name:{
        type: String,
    },
    Email:{
        type: String,
        required: true,
        unique: true,
    },
   Job_tile:{
        type: String,
    },
    Gender:{
        type: String,
        require: true,
    }

})


const User = mongoose.model("user",userData);

app.get("/users", async (info,details) => {
    const datas = await User.find({})
    const print =
    `
    <ul>
    ${datas.map((user) => `<li>${user.first_Name} - ${user.Email}</li>`).join("")}
    </ul>  
    `
    details.send(print)
})

app.route("/users/:id").get((info,details) => {
    const id = Number(info.params.id)
    const user = users.find((user) => user.id === id);
    return details.json(user);
}).post(async (info,details) => {
const body = info.body;
if(!body || !body.first_Name || !body.Last_Name || !body.Email || !body.Gender
    || !body.Job_tile
){
    return details.status(400).json({msg:"Info is not complete"});
} 

const check = await User.create({
    first_Name: body.first_Name,
    Last_Name: body.Last_Name,
    Email: body.Email,
    Job_tile: body.Job_tile,
    Gender: body.Gender,
})

console.log(check);
return details.status(201).json({msg :"Success"})
})

.patch(async(info,details) => {
await User.findByIdAndUpdate(info.params.id, {Last_Name: "Changed"});
return details.json({status: "success"});})

.delete(async(info,details) => {
await User.findByIdAndDelete(info.params.id);
return details.json({status:"success"});
})



app.listen(port,() => console.log(`Port: ${port} Its ok`));