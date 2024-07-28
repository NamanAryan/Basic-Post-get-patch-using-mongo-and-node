const express = require("express");
const mongoose = require("mongoose");
const PORT = 8000;
const app = express();

app.use(express.urlencoded({extended : false}));
//connect
mongoose
.connect("mongodb://127.0.0.1:27017/firstDataBase")
.then(() => {console.log("Mongo Connected!")
});
//schema 
userSchema = new mongoose.Schema({
    firstName:{
        type : String,
        required : true

    },
    lastName:{
        type : String,
        required : true,

    },
    emailID:{
        type : String,
        required : true,
        unique : true
        
    }
});

User = mongoose.model('User', userSchema);

app.get("/users/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    return res.json(user);
})


app.get("/users", async (req, res) => {
    try {
        const allUsers = await User.find({});
        const html = `
        <ul>
            ${allUsers.map(user => `<li>${user.id} - ${user.firstName} - ${user.emailID}</li>`).join('')}
        </ul>
        `;
        res.send(html);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});



app.post("/users", async (req, res) => {
    try {
        const { firstName, lastName, emailID } = req.body;
        const result = await User.create({
            firstName,
            lastName,
            emailID
        });
        console.log("Added", result);
        return res.status(201).json({ msg: "success" });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});


app.patch("/users/:id", async(req, res) =>{
    const id = Number(req.params.id);
    await User.findByIdAndUpdate(req.params.id, req.body);
})

app.delete("/users/:id", async (req, res) =>{
    await User.findByIdAndDelete(req.params.id);
    return res.json({status : "success", msg : "deleted successfully"});
})

app.listen(PORT, () => {
    console.log(`Server started on ${PORT} successfully`);
});