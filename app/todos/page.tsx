"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    // Fetch data from API
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data: any) => {
        console.log("Fetched data:", data);
        setTodos(data);
      });
  }, []);

  useEffect(() => {
    console.log("Updated todos:", todos);
  }, [todos]);

  const addTodo = async () => {
    const res = await fetch("api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo }),
    });
    const todo = await res.json();
    setTodos([...todos, todo]);
    setNewTodo("");
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    const res = await fetch("api/todos/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
  };

  const deleteTodo = async (id: number) => {
    const res = await fetch("api/todos/" + id, {
      method: "DELETE",
    });
    setTodos(todos.filter((todo) => todo.id != id));

    const updateTodo = async (id: number, title: string) => {
      await fetch("/api/todos/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      setTodos(
        todos.map((todo) => (todo.id === id ? { ...todo, title } : todo))
      );
    };

    console.log("dsa");
    return (
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>
        <div className="flex mb-4">
          <input
            className="flex-grow p-2 border rounded-l"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter a new Todo"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
            onClick={addTodo}
          >
            Add Todo
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
                className="form-checkbox"
              />
              <input
                type="text"
                value={todo.title}
                onChange={(e) => updateTodo(todo.id, e.target.value)}
                onBlur={() => updateTodo(todo.id, todo.title)}
                placeholder="Edit title"
                className="flex-grow p-2 border rounded"
              />
              <button
                onClick={() => deleteTodo(todo.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
};

export default TodoApp;
