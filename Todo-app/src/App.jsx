import React, { useEffect, useState } from "react";
import axios from "axios";

const api_base = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [addPopupActive, setAddPopupActive] = useState(false);
  const [updatePopupActive, setUpdatePopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [editTodoId, setEditTodoId] = useState(null); // To store the ID of the todo being edited
  const [editTodoText, setEditTodoText] = useState(""); // To store the new text for the edited todo

  useEffect(() => {
    GetTodos();
  }, []);

  const GetTodos = () => {
    axios
      .get(api_base + "/todos")
      .then((response) => setTodos(response.data))
      .catch((error) => console.error("Error: ", error));
  };

  const completeTodo = async (id) => {
    try {
      const response = await axios.put(api_base + "/todo/complete/" + id);
      const data = response.data;

      setTodos((todos) =>
        todos.map((todo) => {
          if (todo._id === data._id) {
            todo.complete = data.complete;
          }
          return todo;
        })
      );
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const addTodo = async () => {
    try {
      const response = await axios.post(api_base + "/todo/new", {
        text: newTodo,
      });
      const data = response.data;

      setTodos([...todos, data]);
      setAddPopupActive(false);
      setNewTodo("");
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(api_base + "/todo/delete/" + id);
      const data = response.data;

      setTodos((todos) => todos.filter((todo) => todo._id !== data.result._id));
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleEditTodo = (id, text) => {
    setEditTodoId(id);
    setEditTodoText(text);
    setUpdatePopupActive(true);
  };

  const updateTodo = async () => {
    try {
      await axios.patch(api_base + "/todo/update/" + editTodoId, {
        text: editTodoText,
      });

      // Update the todos state with the new text
      setTodos((todos) =>
        todos.map((todo) => {
          if (todo._id === editTodoId) {
            todo.text = editTodoText;
          }
          return todo;
        })
      );

      // Clear the edit mode
      setEditTodoId(null);
      setEditTodoText("");
      setUpdatePopupActive(false);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div className="App">
      <h1>Welcome, Rithvik</h1>
      <h4>Your tasks</h4>

      <div className="todos">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div
              className={"todo" + (todo.complete ? " is-complete" : "")}
              key={todo._id}
            >
              {editTodoId === todo._id && updatePopupActive ? (
                <div className="updatePopup">
                  <inputss
                    type="text"
                    value={editTodoText}
                    onChange={(e) => setEditTodoText(e.target.value)}
                    onBlur={updateTodo}
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  <div
                    className="checkbox"
                    onClick={() => completeTodo(todo._id)}
                  ></div>
                  <div
                    className="text"
                    onClick={() => handleEditTodo(todo._id, todo.text)}
                  >
                    {todo.text}
                  </div>
                  <div
                    className="delete-todo"
                    onClick={() => deleteTodo(todo._id)}
                  >
                    x
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>You currently have no tasks</p>
        )}
      </div>

      <div className="addPopup" onClick={() => setAddPopupActive(true)}>
        +
      </div>

      {addPopupActive && (
        <div className="popup">
          <div className="closePopup" onClick={() => setAddPopupActive(false)}>
            X
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      )}

      {/* Update Popup */}
      {updatePopupActive && (
        <div className="popup">
          <div
            className="closePopup"
            onClick={() => setUpdatePopupActive(false)}
          >
            X
          </div>
          <div className="content">
            <h3>Edit Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setEditTodoText(e.target.value)}
              value={editTodoText}
            />
            <div className="button" onClick={updateTodo}>
              Update Task
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
