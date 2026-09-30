"use client";

import { useState, useSyncExternalStore } from "react";

type Todo = { id: string; text: string; done: boolean };
type Filter = "all" | "active" | "done";

const STORAGE_KEY = "todos-v1";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "active", label: "未完了" },
  { key: "done", label: "完了" },
];

function load(): Todo[] {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const EMPTY: Todo[] = [];
const listeners = new Set<() => void>();
let cache: Todo[] | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return (cache ??= load());
}

function getServerSnapshot() {
  return EMPTY;
}

function setTodos(next: Todo[]) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 保存できない環境ではメモリ上のみで動作する
  }
  listeners.forEach((l) => l());
}

export default function TodoApp() {
  const todos = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [filter, setFilter] = useState<Filter>("all");
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const visible = todos.filter((t) =>
    filter === "active" ? !t.done : filter === "done" ? t.done : true,
  );
  const remaining = todos.filter((t) => !t.done).length;

  function add(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setTodos([...todos, { id: crypto.randomUUID(), text, done: false }]);
    setDraft("");
  }

  function finishEdit(id: string, value: string, commit: boolean) {
    const text = value.trim();
    if (commit && text) {
      setTodos(todos.map((t) => (t.id === id ? { ...t, text } : t)));
    }
    setEditingId(null);
  }

  return (
    <main className="app">
      <h1>TODO</h1>

      <form className="add-form" onSubmit={add}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="やることを入力"
          aria-label="新しいTODO"
          autoFocus
        />
        <button type="submit">追加</button>
      </form>

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={filter === f.key ? "active" : ""}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="todo-list">
        {visible.length === 0 && <li className="empty">TODOはありません</li>}
        {visible.map((todo) => (
          <li key={todo.id} className={todo.done ? "done" : ""}>
            <input
              type="checkbox"
              checked={todo.done}
              aria-label="完了"
              onChange={() =>
                setTodos(todos.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t)))
              }
            />
            {editingId === todo.id ? (
              <input
                className="edit"
                defaultValue={todo.text}
                autoFocus
                onBlur={(e) => finishEdit(todo.id, e.target.value, true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") finishEdit(todo.id, e.currentTarget.value, true);
                  if (e.key === "Escape") setEditingId(null);
                }}
              />
            ) : (
              <span
                className="label"
                title="ダブルクリックで編集"
                onDoubleClick={() => setEditingId(todo.id)}
              >
                {todo.text}
              </span>
            )}
            <button
              className="delete"
              aria-label="削除"
              onClick={() => setTodos(todos.filter((t) => t.id !== todo.id))}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="footer">
        <span>残り {remaining} 件</span>
        {remaining !== todos.length && (
          <button onClick={() => setTodos(todos.filter((t) => !t.done))}>完了を削除</button>
        )}
      </div>
    </main>
  );
}
