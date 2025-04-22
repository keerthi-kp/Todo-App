const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todomodel.js');
require('dotenv').config(); 

const app = express();
app.use(cors());

app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Optional: Stop the server if DB connection fails
  });


app.get('/todos',async (req,res)=>{
  const alltodos= await TodoModel.find()
  res.json(alltodos)

 
});
app.post("/todos", async (req, res) => {
  const todo = new TodoModel({
    text: req.body.text,
    completed: req.body.completed || false,  
  });

  try {
    const savedTodo = await todo.save(); 
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ message: 'Error saving todo', error: err });
  }
});
app.delete("/todos/:id",async (req,res)=>{
  try{
    const deletedtodo=await TodoModel.findByIdAndDelete(req.params.id)
    if(!deletedtodo){
      return res.status(404).json({ message: "Todo not found" })
    }
    res.json({message:'todo deleted',deletedtodo})
  }
  catch(err){
    res.status(500).json({ message: "Error deleting todo", error: err });

  }
})
app.put("/todos/:id",async (req,res)=>{
  try{
    const updatedtodo=await TodoModel.findByIdAndUpdate(req.params.id,{completed:req.body.completed},{new:true})
    res.json(updatedtodo)
  }
  catch(err){
    res.status(500).json({message:"Error updating todo",error:err})
  }

})


const PORT = process.env.PORT || 3050;
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
