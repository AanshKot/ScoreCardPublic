import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();
const collectionName = 'Players'; // Name of the collection

router.get("/:lastname", async (req,res) => {
    let collection = await db.collection(collectionName);
    let query = { "player.lastname": { "$regex": '^' + req.params.lastname, $options: "i"} };

   const players = await collection.find(query).toArray();

   if(players.length === 0){
    res.send("No players found").status(404);
   }

   else{
    console.log(players);
    res.send(players).status(200);
   }
});



export default router;