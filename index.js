import express from "express";
import bodyParser from "body-parser";
import {connection} from "./connection/user.js";
import router from "./routes/user.js";
import env from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  // origin: ["http://localhost:5173"],
  origin: true,
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth',router);
app.use(cookieParser());

env.config();
connection();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
