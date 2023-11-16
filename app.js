// Modules
const express = require("express");
const connectDB = require("./connect");

const port = 5000;
const appName = "Task Manager";
const app = express();

// Middleware
app.use(express.static("./Client")); // sends over the client once someone first accesses the application
app.use(express.json());

// Data model (schema)
const tasks = require("./Task");
const Task = require("./Task");

// get all the tasks
app.get("/api", async (req,res)=>{
  try {
    const task = await tasks.find(); 
    res.status(200).json({task});
  } catch {
    res.status(500).json({msg: error});
  };
});


//add tasks
app.post("/api", async (req, res)=>{
  try{
    const task = await Task.create(req.body);
    
    res.status(200).json({task});
  } catch {
    res.status(500).json({msg: error});
  };
});

//Delete tasks
app.delete("/api/:id", async (req, res)=>{
  try{
    const task = []; // array to be filled for response
    let tmpString = req.params.id; // pulls the string of ids from the parameters
    let stillGoing = true; 
    while(stillGoing){ // loops through the string and pulls out the ids
      let tmpPos = tmpString.indexOf(",");
      if(tmpPos != -1){ // handles chunking up a string if there are multiple ids in it
        tmpId = tmpString.substring(0, (tmpPos));
        task.push = await Task.findByIdAndDelete(tmpId); // deletes the item with the given id
        tmpString = tmpString.substring((tmpPos + 1));
      }
      else{ // handles the deletion of the last item (or single item if only one provided)
        task.push = await Task.findByIdAndDelete(tmpString);
        await Task.findByIdAndDelete(tmpString);
        stillGoing = false; // breaks out of the loop
      }
    }

    res.status(200).json({task});
  } catch {
    res.status(500).json({msg: error});
  };
});

//modify tasks (used mainly for completion of tasks)
app.put("/api", async (req, res)=>{
  try{
    const task = await Task.findByIdAndUpdate(req.body._id, {name: req.body.name, completed: req.body.completed});
    res.status(200).json({task});
  }
  catch{
    res.status(500).json({msg: error});
  }
});


// Connect to the database and start the appl server
const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {console.log(`${appName} is listening on port ${port}.`)});
  } catch (error) {
    console.log(error);
  };
}

start();