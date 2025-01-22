const { MongoClient } = require('mongodb');

const connection_string = "mongodb+srv://admin1:shalom12344321@cluster0.gvd7n.mongodb.net/todoApp?retryWrites=true&w=majority";

(async () => {
    try {
        const client = new MongoClient(connection_string);
        await client.connect();
        console.log("Connected to MongoDB successfully!");
        const database = client.db("todoApp"); // Specify your database name
        console.log(`Using database: ${database.databaseName}`);
        await client.close();
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
})();
