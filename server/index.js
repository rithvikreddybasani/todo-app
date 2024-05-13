const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://todo-app-client-one.vercel.app/",
    methods: ["POST","GET","PUT","DELETE"],
   
  })
);

mongoose
  .connect(
    "mongodb+srv://rithvik:rithvikreddy@nodeexpressprojects.fi4jofi.mongodb.net/finalTodo?retryWrites=true&w=majority&appName=NodeExpressProjects",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch(console.error);

// Models
const Todo = require("./models/Todo");

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/todo/new", async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.json(todo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/todo/delete/:id", async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);
    res.json({ result });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/todo/complete/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.complete = !todo.complete;
    await todo.save();
    res.json(todo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/todo/update/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    todo.text = req.body.text;
    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3001, () => console.log("Server started on port 3001"));
