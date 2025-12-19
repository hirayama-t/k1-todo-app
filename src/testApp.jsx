import React, { useState } from "react";
import "./App.css";

// Bootstrap CDNをindex.htmlで読み込んでください


function TestApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("中");
  const [important, setImportant] = useState(false);
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
      {
        text: input.trim(),
        completed: false,
        id: Date.now(),
        dueDate: dueDate,
        priority: priority,
        important: important,
      },
    ]);
    setInput("");
    setDueDate("");
    setPriority("中");
    setImportant(false);
  }
  // 重要フラグ切替
  function handleImportantToggle(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, important: !todo.important } : todo
      )
    );
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
  const version = "1.0.1";

  return (
    <div>
      <div className="header-custom mb-4 rounded-bottom">
        <h2 className="mb-0">業務用Todo管理アプリ</h2>
        <small className="text-muted">バージョン {version}</small>
      </div>
      <div className="body-custom rounded shadow-sm mx-auto" style={{maxWidth: 500}}>
        <form onSubmit={handleAdd} className="todo-form" style={{flexWrap: 'wrap', gap: '0.5rem'}}>
          <input
            type="text"
            className="form-control"
            style={{minWidth: 0, flex: 2}}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="新しいタスクを入力"
          />
          <input
            type="date"
            className="form-control"
            style={{minWidth: 0, flex: 1}}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="期日"
          />
          <select
            className="form-select"
            style={{minWidth: 0, flex: 1}}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="高">高</option>
            <option value="中">中</option>
            <option value="低">低</option>
          </select>
          <div className="form-check" style={{display: 'flex', alignItems: 'center', flex: 1}}>
            <input
              className="form-check-input"
              type="checkbox"
              checked={important}
              id="important-input"
              onChange={(e) => setImportant(e.target.checked)}
            />
            <label className="form-check-label ms-1" htmlFor="important-input">重要</label>
          </div>
          <button type="submit" className="btn btn-primary" style={{flex: 1}}>追加</button>
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
                  {todo.important && <span title="重要" style={{color: 'red', marginLeft: 6, fontWeight: 'bold'}}>★</span>}
                </label>
                <span className="badge bg-secondary ms-2">{todo.priority}優先</span>
                {todo.dueDate && <span className="badge bg-light text-dark ms-2">期日: {todo.dueDate}</span>}
                <button
                  className={`btn btn-sm ms-2 ${todo.important ? 'btn-warning' : 'btn-outline-warning'}`}
                  title="重要フラグ切替"
                  onClick={() => handleImportantToggle(todo.id)}
                >
                  {todo.important ? '重要解除' : '重要!'}
                </button>
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
