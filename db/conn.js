const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dbUrl = process.env.DB_URL || "mongodb+srv://chhariavikram1:"+ process.env.MONGO_ATLAS_PW + "@redgrapes.j7mi4.mongodb.net/redgrapes"

mongoose.connect(dbUrl, {
}).then(() => {
    console.log(`connection successfull`);
}).catch((err) => {
    console.log(`no connection`);
})