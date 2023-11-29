import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";
import pool, { testDbConnection } from "./db/db.js";
import { createTable, createUpload } from "./db/queries.js";

// configs
//===================================================================
const app = express();
const port = 3000;

//default option
app.use(fileUpload());

// db use JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// config templates and EJS
app.set("view engine", "ejs");
app.set("views", [path.join(__dirname, "views", "templates")]);

// routes
//===================================================================
app.get("", (req, res) => {
  const thumbnailPath = req.query.thumbnailPath;
  res.render("home", { thumbnailPath });
});

app.post("", (req, res) => {
  //upload funct
  let thumbnail;
  let relativePath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded");
  }

  // name of input is thumbnail
  thumbnail = req.files.thumbnail;
  relativePath = "/uploads/" + thumbnail.name;
  console.log(" "); 
  console.log("thumbnail :", thumbnail); 
  console.log(" "); 
  console.log("relativePath :", relativePath); 

  // Use mv() to place file on the server
  thumbnail.mv(path.join(__dirname, "uploads", thumbnail.name), async function (err) {
    // error => error
    if (err) return res.status(500).send(err);

    // if OK. createTable, upload to table, send msg
    const [table] = await pool.execute(createTable);
    // Check if table was created or already existed
    if (table.affectedRows === 0) {
      console.log(" ");
      console.log("Table already existed.");
    } else {
      console.log(" ");
      console.log("Table created successfully.");
    }

    // upload to table
    const [rows] = await pool.execute(createUpload, [thumbnail.name]);

    //msg
    console.log(" ");
    console.log(" ");
    console.log(`File uploaded!`);

    //redirect When done
    if (!err) {
      res.redirect(`/?thumbnailPath=${relativePath}`);
    } else {
      console.log(err);
    }
  });
});

// app middleware for 404
//===================================================================
app.use((req, res) => {
  res.status(404).json({
    message: "endpoint Not Found",
  });
});

// start app
//   =========================================================================
// Call the function to test the database connection during app startup
const startApp = async () => {
  try {
    await testDbConnection();
    app.listen(port, () => console.log(`Listening on ${port}`));
  } catch (error) {
    // Handle initialization failure, maybe exit the process
    console.error("Failed to start the app:", error.message);
    process.exit(1); // Exit with a non-zero code to indicate failure
  }
};

startApp();

export default app;
