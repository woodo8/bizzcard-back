import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import swaggerUi from 'swagger-ui-express'
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerFile = require("./swagger_output.json");

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors());

app.use("/user", authRoutes)

app.get("/", (req, res) => {
    res.send("Hello guys!!!!");
})

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

const PORT = process.env.PORT || 5000;

mongoose.connect(
    process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    }))
    .catch((error) => console.log(error.message)
    )


// M0QJ3wawbXhSI0jY