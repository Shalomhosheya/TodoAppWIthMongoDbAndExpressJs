var Express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");

var app = Express();
app.use(cors());
app.use(Express.json()); // Middleware for parsing JSON bodies

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
        res.json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to add a note
app.post("/api/v1/todoApp/Addnote", multer().none(), async (req, res) => {
    if (!database) {
        return res.status(500).send("Database not initialized yet.");
    }

    const { newNotes } = req.body;
    if (!newNotes) {
        return res.status(400).json({ error: "Note content is required" });
    }

    try {
        const note = {
            id: (await database.collection("todoAppcollection").countDocuments() + 1).toString(),
            description: newNotes,
        };

        await database.collection("todoAppcollection").insertOne(note);
        res.json({ message: "Note added successfully", note });
    } catch (error) {
        console.error("Error adding note:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to delete a note
app.delete("/api/v1/todoApp/DeleteNote", async (req, res) => {
    if (!database) {
        return res.status(500).send("Database not initialized yet.");
    }

    const id = req.query.id;
    if (!id) {
        return res.status(400).json({ error: "Note ID is required" });
    }

    try {
        const result = await database.collection("todoAppcollection").deleteOne({ id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Note not found" });
        }
        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error deleting note:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
