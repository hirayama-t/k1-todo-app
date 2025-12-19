import React, { useState } from "react";
import "./App.css";

// Bootstrap CDNをindex.htmlで読み込んでください

function TestApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  // タスク追加
  function handleAdd(e) {
    e.preventDefault();
    if (!validateTaskInput(input)) {
      alert("タスク内容を入力してください。");
      return;
    }
    setTodos([
      ...todos,
      { text: input.trim(), completed: false, id: Date.now() },
    ]);
    setInput("");
  }

  // 完了状態切替
  function handleToggle(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  // タスク削除
  function handleDelete(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  // フィルタ切替
  function handleFilter(newFilter) {
    setFilter(newFilter);
  }

  // フィルタリング
  function getFilteredTodos() {
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }

  // バリデーションチェック関数（シンプルな実装）
  function validateTaskInput(value) {
    return typeof value === "string" && value.trim().length > 0;
  }


  // 件数
  const totalCount = todos.length;
  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  // バージョン情報を追加する
  const version = "1.0.0";

  return (
    <div>
      <div className="header-custom mb-4 rounded-bottom">
        <h2 className="mb-0">業務用Todo管理アプリ</h2>
        <small className="text-muted">バージョン {version}</small>
      </div>
      <div className="body-custom rounded shadow-sm mx-auto" style={{maxWidth: 500}}>
        <form onSubmit={handleAdd} className="todo-form">
          <input
            type="text"
            className="form-control"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="新しいタスクを入力"
          />
          <button type="submit" className="btn btn-primary">追加</button>
        </form>
        <div className="filter-btns">
          <button
            className={`btn btn-sm ${filter === "all" ? "btn-info text-white" : "btn-outline-info"}`}
            onClick={() => handleFilter("all")}
          >全て({totalCount})</button>
          <button
            className={`btn btn-sm ${filter === "active" ? "btn-warning text-white" : "btn-outline-warning"}`}
            onClick={() => handleFilter("active")}
          >未完了({activeCount})</button>
          <button
            className={`btn btn-sm ${filter === "completed" ? "btn-success text-white" : "btn-outline-success"}`}
            onClick={() => handleFilter("completed")}
          >完了({completedCount})</button>
        </div>
        <ul className="todo-list">
          {getFilteredTodos().map((todo) => (
            <li key={todo.id} className={todo.completed ? "completed" : ""}>
              <div style={{display: 'flex', alignItems: 'center', flex: 1}}>
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id)}
                  id={`todo-${todo.id}`}
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  style={{flex: 1, cursor: "pointer", userSelect: "none"}}
                >
                  {todo.text}
                </label>
              </div>
              <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => handleDelete(todo.id)}>
                削除
              </button>
            </li>
          ))}
        </ul>
        {getFilteredTodos().length === 0 && (
          <div className="text-center text-muted mt-3">タスクがありません</div>
        )}
      </div>
    </div>
  );
}

export default TestApp;
