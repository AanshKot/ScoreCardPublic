import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import players from "./routes/player.mjs";
import compareplayer from "./routes/compareplayer.mjs";
import cron from 'node-cron';
// import "./scripts/cron.mjs";
const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/player", players);
app.use("/compareplayer",compareplayer);
// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);

  // cron.schedule('0 13 */3 * *', async () => {
  //   await deleteAndRefreshPlayersCollection();
  // });
});