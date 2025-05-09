import { setupCalendarFeature } from "./js/Calendar.js";
import { initializeFiltering } from "./js/Filtering.js";

const list = document.getElementById("list");
const createBtn = document.getElementById("create-btn");

export let todos = [];

createBtn.addEventListener("click", createNewTodo);

function createNewTodo() {
  // 새로운 아이템 객체 생성
  const item = {
    id: new Date().getTime(),
    text: "",
    complete: false,
  };

  todos.unshift(item);

  // 요소 생성하기
  const { itemEl, inputEl, calendarBtnEl, editBtnEl, removeBtnEl } =
    createTodoElement(item);

  list.prepend(itemEl);

  inputEl.removeAttribute("disabled");

  inputEl.focus();
  saveToLocalStorage();
}

export function createTodoElement(item) {
  const itemEl = document.createElement("div");
  itemEl.classList.add("item");

  const extrainput = document.createElement("div");
  extrainput.classList.add("extrainput");

  const checkboxEl = document.createElement("input");
  checkboxEl.type = "checkbox";
  checkboxEl.checked = item.complete;

  if (item.complete) {
    itemEl.classList.add("complete");
  }

  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.value = item.text;
  inputEl.classList.add("list-title-input");
  inputEl.setAttribute("disabled", "");

  const memoEl = document.createElement("input");
  memoEl.type = "text";
  memoEl.classList.add("memo-input");

  if (!item.memo) item.memo = "";
  memoEl.value = item.memo;

  memoEl.addEventListener("input", () => {
    item.memo = memoEl.value;
  });

  memoEl.addEventListener("blur", () => {
    saveToLocalStorage();
  });

  const actionsEl = document.createElement("div");
  actionsEl.classList.add("actions");

  const calendarBtnEl = document.createElement("button");
  calendarBtnEl.classList.add("material-icons", "calendar-btn");
  calendarBtnEl.innerText = "calendar_today";
  //달력 아이콘 클릭 시 날짜 추가 가능
  setupCalendarFeature(item, calendarBtnEl, actionsEl, saveToLocalStorage);

  const editBtnEl = document.createElement("button");
  editBtnEl.classList.add("material-icons");
  editBtnEl.innerText = "edit";

  const removeBtnEl = document.createElement("button");
  removeBtnEl.classList.add("material-icons", "remove-btn");
  removeBtnEl.innerText = "remove_circles";

  checkboxEl.addEventListener("change", () => {
    item.complete = checkboxEl.checked;

    if (item.complete) {
      itemEl.classList.add("complete");
    } else {
      itemEl.classList.remove("complete");
    }
    saveToLocalStorage();
  });

  inputEl.addEventListener("blur", () => {
    inputEl.setAttribute("disabled", "");
    saveToLocalStorage();
  });

  inputEl.addEventListener("input", () => {
    item.text = inputEl.value;
  });

  calendarBtnEl.addEventListener("click", () => {
    inputEl.focus();
  });

  editBtnEl.addEventListener("click", () => {
    inputEl.removeAttribute("disabled");
    inputEl.focus();
  });

  removeBtnEl.addEventListener("click", () => {
    todos = todos.filter((t) => t.id !== item.id);
    itemEl.remove();
    saveToLocalStorage();
  });

  extrainput.append(inputEl);
  extrainput.append(memoEl);

  itemEl.append(checkboxEl);
  itemEl.append(extrainput);
  itemEl.append(actionsEl);

  actionsEl.append(calendarBtnEl);
  actionsEl.append(editBtnEl);
  actionsEl.append(removeBtnEl);

  return { itemEl, inputEl, calendarBtnEl, editBtnEl, removeBtnEl };
}

function saveToLocalStorage() {
  const data = JSON.stringify(todos);

  localStorage.setItem("my_todos", data);
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("my_todos");

  if (data) {
    todos = JSON.parse(data);
  }
}

function displayTodos() {
  loadFromLocalStorage();

  initializeFiltering();
}

displayTodos();
