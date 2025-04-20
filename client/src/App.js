import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3050/todos")
      .then((response) => setTodos(response.data))
      .catch((err) => console.log("Error occurred:", err));
  }, []);

  const createTask = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3050/todos", { text: task })
      .then((res) => {
        setTodos([...todos, res.data]);
        setTask("");
      })
      .catch(err => console.error(err));
  };
  const deleteTask = (id) => {
    axios.delete(`http://localhost:3050/todos/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));
      })
      .catch(err => console.error("Error deleting task:", err));
  };
  const toggleComplete = (id, completed) => {
    axios.put(`http://localhost:3050/todos/${id}`, { completed })
      .then((res) => {
        setTodos(todos.map(todo =>
          todo._id === id ? res.data : todo
        ));
      })
      .catch(err => console.error("Error updating todo:", err));
  };
  
  

  return (
    <div className="app-container">
      <h1>📝 Todo List</h1>
      
      <form className='create-form' onSubmit={createTask}>
        <input
          type='text'
          placeholder='Enter a task'
          value={task}
          onChange={(e) => setTask(e.target.value)}
          required
        />
        <button type='submit'>ADD</button>
      </form>

      {todos.length === 0 ? (
        <div className="no-todos"><h2>No records</h2></div>
      ) : (
        <ul className="todo-list">
  {todos.map((todo) => (
    <li key={todo._id} className="todo-item">
      <div className="todo-box">
        <span
          className={`todo-text ${todo.completed ? 'completed-text' : ''}`}
          onClick={() => toggleComplete(todo._id, !todo.completed)}
        >
          {todo.text}
        </span>
        <button className="delete-btn" onClick={() => deleteTask(todo._id)}>
          Delete
        </button>
      </div>
    </li>
  ))}
</ul>

      )}
    </div>
  );
}

export default App;