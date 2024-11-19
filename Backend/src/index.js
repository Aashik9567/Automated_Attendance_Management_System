import connectDb from "./database/db.js";
import dotenv from "dotenv";
import {app} from "./app.js";
dotenv.config({
    path:'./.env'
})

connectDb().
then(() =>{
    app.listen(process.env.PORT||8080,() => {
        console.log(`Server running on port ${process.env.PORT}`);
    })
})
.catch((error) => console.error("mongodb connection failed!!",error));