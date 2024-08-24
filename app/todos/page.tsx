"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Plus, Edit2 } from "lucide-react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempTitle, setTempTitle] = useState<string>("");

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data: Todo[]) => {
        setTodos(data);
      })
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo }),
      });
      const todo = await res.json();
      setTodos([...todos, todo]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      if (res.ok) {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !completed } : todo
          )
        );
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const updateTodo = debounce(async (id: number, newTitle: string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, title: newTitle } : todo
          )
        );
        setEditingId(null);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }, 500);

  const handleTitleChange = (newTitle: string) => {
    setTempTitle(newTitle);
  };

  const startEditing = (id: number, currentTitle: string) => {
    setEditingId(id);
    setTempTitle(currentTitle);
  };

  const saveEdit = () => {
    if (editingId !== null) {
      updateTodo(editingId, tempTitle);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
          Task Manager
        </h1>
        <div className="mb-8">
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              className="flex-grow px-4 py-3 rounded-l-md border-0 focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
            />
            <button
              onClick={addTodo}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus size={20} className="mr-2" />
              Add Task
            </button>
          </div>
        </div>
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <div className="p-4 flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 ${
                    todo.completed
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300"
                  } flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                >
                  {todo.completed && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
                <div className="flex-grow">
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      onBlur={saveEdit}
                      className="w-full px-2 py-1 text-gray-700 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                      autoFocus
                    />
                  ) : (
                    <p
                      className={`text-gray-800 break-words ${
                        todo.completed ? "line-through text-gray-500" : ""
                      }`}
                      onDoubleClick={() => startEditing(todo.id, todo.title)}
                    >
                      {todo.title}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 flex space-x-2">
                  <button
                    onClick={() => startEditing(todo.id, todo.title)}
                    className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;
