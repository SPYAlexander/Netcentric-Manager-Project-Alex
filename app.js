// Import necessary modules and setup Express
const express = require("express");
const connectDB = require("./connect");

// Set the port number and the application name
const port = 5000;
const appName = "Task Manager";
const app = express();

// Serve static files from the "Client" directory
app.use(express.static("./Client"));

// Enable parsing of JSON data in the request body
app.use(express.json());

// Import the Task model
const tasks = require("./Task");
const Task = require("./Task");

// Define a route to handle GET requests to retrieve tasks
app.get("/api", async (req, res) => {
  try {
    // Retrieve all tasks from the database
    const task = await tasks.find();
    // Send a JSON response with the retrieved tasks
    res.status(200).json({ task });
  } catch (error) {
    // If an error occurs, send a 500 Internal Server Error response with the error message
    res.status(500).json({ msg: error });
  }
});

// Handle POST requests to create a new task
app.post("/api", async (req, res) => {
  try {
    // Create a new task using the data from the request body
    const task = await Task.create(req.body);
    
    // Send a JSON response with the created task
    res.status(200).json({ task });
  } catch (error) {
    // If an error occurs, send a 500 Internal Server Error response with the error message
    res.status(500).json({ msg: error });
  }
});

// Handle DELETE requests to delete one or more tasks by ID
app.delete("/api/:id", async (req, res) => {
  try {
    // Initialize an array to store deleted tasks
    const task = [];

    // Extract the ID string from the request parameters
    let tmpString = req.params.id; 
    let stillGoing = true; 

    // Loop to handle multiple IDs separated by commas
    while (stillGoing) { 
      let tmpPos = tmpString.indexOf(",");
      if (tmpPos != -1) { 
        // Extract ID and delete the corresponding task
        tmpId = tmpString.substring(0, (tmpPos));
        task.push = await Task.findByIdAndDelete(tmpId); 
        tmpString = tmpString.substring((tmpPos + 1));
      } else { 
        // Delete the last ID in the string
        task.push = await Task.findByIdAndDelete(tmpString);
        stillGoing = false; 
      }
    }

    // Send a JSON response with the deleted tasks
    res.status(200).json({ task });
  } catch (error) {
    // If an error occurs, send a 500 Internal Server Error response with the error message
    res.status(500).json({ msg: error });
  }
});

// Handle PUT requests to update a task
app.put("/api", async (req, res) => {
  try {
    // Update the task with the specified ID using the data from the request body
    const task = await Task.findByIdAndUpdate(req.body._id, { name: req.body.name, completed: req.body.completed });
    // Send a JSON response with the updated task
    res.status(200).json({ task });
  } catch (error) {
    // If an error occurs, send a 500 Internal Server Error response with the error message
    res.status(500).json({ msg: error });
  }
});

// Function to start the application
const start = async () => {
  try {
    // Connect to the database
    await connectDB();
    // Start the Express app and listen on the specified port
    app.listen(port, () => {
      console.log(`${appName} is listening on port ${port}.`);
    });
  } catch (error) {
    console.log(error);
  }
}

// Call the start function to begin the application
start();
