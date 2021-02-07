const express = require("express")
const mongoose = require("mongoose")
const app = express()
mongoose.connect("mongodb://localhost/rest", { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on("error", (error)=> { console.log("Error:"+ error); })
db.once("open", ()=> { console.log("Connection ok"); })
app.use(express.json())

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email:{ type: String, required: true },
    date:{ type: String, required: true, default: Date.now }
})
const User = mongoose.model("User", userSchema);
async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({ message: "User not found"})
        }
    } catch (error) {
        return res.status(500).json({ message: error})
    }
    res.user = user
    next()
}

app.get("/", async (req, res)=>{
    try {
        const user = await User.find();
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
app.post("/create", async (req, res)=>{
    const user = new User({
        name: req.body.name,
        email: req.body.email
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})
app.get("/read/:id", getUser, (req, res)=>{
    res.send(res.user);
})
app.patch("/update/:id", getUser, async (req, res)=>{ 
    if (req.body.name != null) {
        res.user.name = req.body.name
    }
    if (req.body.email != null) {
        res.user.email = req.body.email
    }
    try {
        const updated = await res.user.save()
        res.json({ message: "User is updated" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})
app.delete("/delete/:id", getUser, async (req, res)=>{ 
    try {
        await res.user.remove()
        res.json({ message: "User is deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})  
app.listen(3456, () => { console.log("http://localhost:3456"); });

/*
GET http://localhost:3456/
###
POST http://localhost:3456/create
Content-Type: application/json

{
    "name": "Anıl Şenocak",
    "email": "anil@senocak.com"
}
### 
GET http://localhost:3456/read/5da5a38573d89c8f3ce6636b
###
DELETE  http://localhost:3456/delete/5da5a38573d89c8f3ce6636b
###
PATCH http://localhost:3456/update/5da5a38573d89c8f3ce6636b
Content-Type: application/json

{
    "name": "Anıl Şenocak2",
    "email": "anil@senocak.com"
}
*/