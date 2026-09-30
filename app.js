const STORAGE_KEY = "todos-v1";

const form = document.getElementById("add-form");
const input = document.getElementById("new-todo");
const list = document.getElementById("todo-list");
const count = document.getElementById("count");
const clearDone = document.getElementById("clear-done");
const filterButtons = document.querySelectorAll(".filters button");

let todos = load();
let filter = "all";

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // 保存できない環境ではメモリ上のみで動作する
  }
}

function visibleTodos() {
  if (filter === "active") return todos.filter((t) => !t.done);
  if (filter === "done") return todos.filter((t) => t.done);
  return todos;
}

function render() {
  list.textContent = "";
  const items = visibleTodos();

  if (items.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "TODOはありません";
    list.append(li);
  }

  for (const todo of items) {
    const li = document.createElement("li");
    li.dataset.id = todo.id;
    if (todo.done) li.classList.add("done");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = todo.done;
    check.setAttribute("aria-label", "完了");

    const label = document.createElement("span");
    label.className = "label";
    label.textContent = todo.text;
    label.title = "ダブルクリックで編集";

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "✕";
    del.setAttribute("aria-label", "削除");

    li.append(check, label, del);
    list.append(li);
  }

  const remaining = todos.filter((t) => !t.done).length;
  count.textContent = `残り ${remaining} 件`;
  clearDone.hidden = remaining === todos.length;

  filterButtons.forEach((b) => b.classList.toggle("active", b.dataset.filter === filter));
}

function update(mutator) {
  mutator();
  save();
  render();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  update(() => todos.push({ id: crypto.randomUUID(), text, done: false }));
  input.value = "";
});

list.addEventListener("click", (e) => {
  const li = e.target.closest("li[data-id]");
  if (!li) return;
  const id = li.dataset.id;
  if (e.target.matches(".delete")) {
    update(() => { todos = todos.filter((t) => t.id !== id); });
  } else if (e.target.matches("input[type=checkbox]")) {
    update(() => { const t = todos.find((t) => t.id === id); t.done = !t.done; });
  }
});

list.addEventListener("dblclick", (e) => {
  if (!e.target.matches(".label")) return;
  const li = e.target.closest("li");
  const todo = todos.find((t) => t.id === li.dataset.id);

  const edit = document.createElement("input");
  edit.className = "edit";
  edit.value = todo.text;
  e.target.replaceWith(edit);
  edit.focus();

  let finished = false;
  const finish = (commit) => {
    if (finished) return;
    finished = true;
    const text = edit.value.trim();
    if (commit && text) update(() => { todo.text = text; });
    else render();
  };
  edit.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") finish(true);
    if (ev.key === "Escape") finish(false);
  });
  edit.addEventListener("blur", () => finish(true));
});

filterButtons.forEach((b) =>
  b.addEventListener("click", () => { filter = b.dataset.filter; render(); })
);

clearDone.addEventListener("click", () => update(() => { todos = todos.filter((t) => !t.done); }));

render();
