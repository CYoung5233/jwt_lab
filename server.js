const express = require("express")
const jwt = require("jsonwebtoken")
const fs = require("fs")

const app = express()

let publicKey = fs.readFileSync("./keys/public.pem", "utf8")
publicKey = publicKey.replace("-----BEGIN PUBLIC KEY-----", "")
publicKey = publicKey.replace("-----END PUBLIC KEY-----", "")
publicKey = publicKey.trim()


app.get("/login", (req,res)=>{

    const privateKey = fs.readFileSync("./keys/private.pem")

    const token = jwt.sign(
        { user:"bob", role:"user"},
        privateKey,
        { algorithm:"RS256"}
    )

    res.json({token})
})

app.get("/admin",(req,res)=>{

    const token = req.headers.authorization?.split(" ")[1]

    try{

        const decoded = jwt.verify(token, publicKey)

        if(decoded.role==="admin"){
            return res.status(200).send("ADMIN ACCESS GRANTED\n")
        }

        res.send("Not admin\n")

    }catch(e){
        res.status(401).send("Invalid token\n")
    }

})

app.listen(3000, ()=>console.log("running"))