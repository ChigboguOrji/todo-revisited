console.log("Todo list web application");

let form = document.getElementById("new-item-form");
let notif = document.querySelector("#action-notif");

if ("indexedDB" in window) {
  console.log("indexedDB supported");

  var db;

  let oDB = indexedDB.open("todos", 1);

  oDB.onupgradeneeded = function (e) {
    let res = e.target.result;

    if (!res.objectStoreNames.contains("todos")) {
      let obj = res.createObjectStore("todos", {
        keyPath: "title",
        unique: true,
      });

      obj.createIndex("importance", "importance", {
        unique: false,
        autoIncrement: true,
      });
    }
    console.log("oDB running onupgrageneeded");
  };

  oDB.onsuccess = function (e) {
    db = e.target.result;

    form.addEventListener("submit", cTI, false);
    form.title.focus();
    setInterval(() => clearElem(), 50);
    console.log("oDB running onsuccess");
  };

  oDB.onerror = function (e) {
    console.log("oDB running onerror");
    console.dir(e);
  };
}

function cTI(e) {
  e.preventDefault();

  // hide error div
  if (notif) notif.hidden = true ? !notif.hidden : notif.hidden;

  let title = form.title.value,
    task = form.task.value,
    importance = form.importance.value,
    year = form.year.value,
    month = form.month.value,
    day = form.day.value,
    deadLine = new Date(year, month, day).toUTCString().slice(0, 16);

  let errMsg = {
    _1: `<i class="fas fa-bell fa-lg"></i><br />
    Please all fields are required.<br />
      Try to fill them out - they help you remember your todo items.`,

    _2: `
      <h4>
      <span class="notif-error">&times;</span>
      Error occured
      </h4>
      An item with the same title of <b>&#39;${title}&#39;</b> already exist.<br />
      For your todo items to save properly, please make all titles unique.
      `,

    _3: `
      <h4 >
      <span class="notif-success" id="notif-icon">&check;</span>
      <span id="notif-msg">SUCCESS!!!</span>
      </h4>
      <span>Item was successfully added to the list<br />please regularly
    check your todos to stay updated with the time and schedules.</span>
    `,
  };

  if (!title || !task || !year || !month || !day) {
    printMsg("section", errMsg._1, {
      class: "warn",
      id: "action-notif",
    });

    return false;
  }

  let todoItems = {
    title: title,
    task: task,
    importance: importance,
    deadLine: deadLine,
    createdOn: Date.now(),
  };

  // save item to database
  let transaction = db.transaction(["todos"], "readwrite");
  let store = transaction.objectStore("todos");

  let saveTodo = store.add(todoItems);
  saveTodo.onsuccess = function (e) {
    printMsg("section", errMsg._3, {
      class: "success",
      id: "action-notif",
    });

    form.reset();
  };

  saveTodo.onerror = function (e) {
    let saveErr = saveTodo.error.name;

    if (saveErr == "ConstraintError") {
      printMsg("section", errMsg._2, {
        class: "warn",
        id: "action-notif",
      });
    }
    e.preventDefault();
  };
  form.title.focus();
}

function printMsg(target, msg, styles) {
  target = document.createElement(target);
  target.innerHTML = msg;

  for (let style in styles) {
    target.setAttribute(style, styles[style]);
  }

  document.body.appendChild(target);
  form.title.focus();
}

// remove error message
function clearElem() {
  let notice = document.getElementById("action-notif");

  if (!notice) return;
  setTimeout(() => notice.remove(), 5000);
}

// send notification
function setNotif(todoArray) {
  let countNotif = document.getElementById("item-count");
  if (!todoArray) return;

  let totalItem = todoArray.length || 0;
  console.log(totalItem);
  countNotif.innerHTML = +totalItem;
  return countNotif;
}
