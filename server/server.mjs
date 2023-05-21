import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import players from "./routes/player.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/player", players);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});