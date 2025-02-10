import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import apiRoute from "./routes/api.route.js";

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", apiRoute);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
