var Express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");

var app = Express();
app.use(cors());

const connection_string = "mongodb+srv://admin1:shalom12344321@cluster0.gvd7n.mongodb.net/todoApp?retryWrites=true&w=majority";
const databaseName = "todoApp";

let database;

// Connect to MongoDB and initialize the database
MongoClient.connect(connection_string, { useUnifiedTopology: true })
    .then(client => {
        database = client.db(databaseName);
        console.log("Connected to MongoDB");
    })
    .catch(error => {
        console.error("Error connecting to MongoDB:", error.message);
    });

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

// Route to get notes
app.get("/api/v1/todoApp/getNotes", async (req, res) => {
    if (!database) {
        return res.status(500).send("Database not initialized yet.");
    }

    try {
        const notes = await database
            .collection("todoAppcollection")
            .find({})
            .toArray();
        res.send(notes);
    } catch (error) {
        console.error("Error fetching notes:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/api/v1/todoApp/Addnote",multer().none(),(request,response) => {
   database.collection("todoAppcollection").count({},function (error,numOfDocs) {
   database.collection("todoAppcollection").insertOne({
   id:(numOfDocs + 1).toString(),
   description:request.body.newNotes
   });
   response.json("Note added successfully")  
})
});

