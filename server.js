const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();
const pool = require("./db");
const path = require("path");
const fs = require("fs");



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "images/"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
//upload images
app.post("/test", upload.single("selectedImage"), (req,res) => {
  res.status(200).json({message: "image uploaded"});
});
//send image
// Ajoutez cette route après la configuration de l'upload
app.get("/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, "images/", imageName);

  // Vérifiez si le fichier existe
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Le fichier n'existe pas
      res.status(404).json({ message: "Image not found" });
    } else {
      // Le fichier existe, renvoyer l'image
      res.sendFile(imagePath);
    }
  });
});

//upload palt
app.post("/insert/cour",async (req, res) => {
  try {
    const { title,Image,price } = req.body;

  console.log(req.body)
    const newBILLETTES = await pool.query(
      "INSERT INTO cour (title, image, price ) VALUES ($1, $2, $3) RETURNING *",
      [title, Image, price]
    );
    res.json(newBILLETTES.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erreur lors de l'insertion du cour." });
  }
});
//select max id cour
app.get("/max/id_cour", async (req, res) => {
  try {
    
    const todo = await pool.query("SELECT max(id)+1 as max from cour");

    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
app.get("/select/coures", async (req, res) => {
  try {
    
    const todo = await pool.query("SELECT * from cour ;");

    res.json(todo.rows);
  } catch (err) {
    console.error(err.message);
  }
});
app.get("/select/coures/LIMIT", async (req, res) => {
  try {
    
    const todo = await pool.query("SELECT * from cour LIMIT 6;");

    res.json(todo.rows);
  } catch (err) {
    console.error(err.message);
  }
});
app.delete("/delete/cour/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM cour WHERE id = $1", [
      id
    ]);
    res.json("cour was deleted!");
   
  } catch (err) {
    console.log(err.message);
  }
});
///modifier nom de cour 
app.post("/modifier/cour/nom/:id/:nom", async (req, res) => {
  try {
    const { id } = req.params;
    const { nom } = req.params;
    const deleteTodo = await pool.query("UPDATE cour SET title = $1 WHERE id = $2", [
      nom ,id
    ]);
    res.json("cour nom was modifier!");
  } catch (err) {
    console.log(err.message);
  }
});
//modifier price
app.post("/modifier/cour/price/:id/:price", async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.params;
    const deleteTodo = await pool.query("UPDATE cour SET price = $1 WHERE id = $2", [
      price ,id
    ]);
    res.json("cour price was modifier!");
  } catch (err) {
    console.log(err.message);
  }
});
 app.listen(4000, () => console.log("Server on localhost:4000"));
