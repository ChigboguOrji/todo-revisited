let todoArray = [];
let category = document.getElementsByName(".category");

if ("indexedDB" in window) {
  console.log("indexedDB supported");

  var db;

  let oDB = indexedDB.open("todos", 1);

  // upgrade
  oDB.onupgradeneeded = function (e) {
    let res = e.target.result;

    if (!res.objectStoreNames.contains("todos")) {
      res.createObjectStore("todos", {
        keyPath: "title",
        unique: true,
      });
    }
    console.log("oDB running onupgrageneeded");
  };

  // success
  oDB.onsuccess = function (e) {
    db = e.target.result;
    getAllTodos();
    filterDisplay(category);
    console.log("oDB running onsuccess");
  };

  // error
  oDB.onerror = function (e) {
    console.log("oDB running onerror");
    console.dir(e);
  };
}

function getAllTodos() {
  let transaction = db.transaction("todos");
  let store = transaction.objectStore("todos");

  let getTodos = store.openCursor();

  getTodos.onsuccess = function (e) {
    let cursor = getTodos.result;

    if (cursor) {
      let value = cursor.value;
      todoArray.push(value);
      cursor.continue();
    }
  };

  transaction.oncomplete = function (e) {
    allToDom(todoArray);
    setNotif(todoArray);

    [].forEach.call(document.querySelectorAll("[data-delete]"), function (btn) {
      btn.addEventListener("click", deleteItem, false);
    });
  };
}

function allToDom(objArray) {
  let ul = document.getElementById("output-items");

  for (let item of objArray) {
    if (typeof item == "object") {
      item.isDone = false;

      let itemList = `<h4>Schedules&#39; title : <span class="title">${item.title}</span></h4>
      <li>Schedules&#39; objective : ${item.task}</li>
      <li>Schedules&#39; importance : ${item.importance}</li>
      <li>Schedules&#39; due date : ${item.deadLine}</li>
      <li>Schedules&#39; status : ${item.isDone}</li>
      <span class="del-btn" data-delete="delete" title ="Delete this schedule">
      <i class="fas fa-trash-alt fa-lg"></i></span>
      `;

      let div = document.createElement("div");
      div.classList.add("item-list-container");
      let domFrag = document.createDocumentFragment();
      div.innerHTML = itemList;
      domFrag.appendChild(div);
      ul.appendChild(domFrag);
    }
  }
}

function setNotif(todoArray) {
  let countNotif = document.getElementById("item-count");
  if (!todoArray) return;

  let totalItem = !0 ? todoArray.length : 0;
  countNotif.innerHTML = +totalItem;
  return countNotif;
}

function filterDisplay(category) {
  for (let x = 0, max = category.length; x < max; x++) {
    console.log(category[x]);
    category[x].addEventListener("change", filterList, false);
  }
  // let displayingFor = document.getElementById("displaying-for");
  // displayingFor.innerHTML = `<b style="color:rgb(122, 95, 6);">${category}</b>`;

  // category = category.toLowerCase();
  // category == "all" ? getAllTodos() : filterList(category);
}

function filterList() {
  let transaction = db.transaction("todos");
  let store = transaction.objectStore("todos");
  let idxKey = store.index("importance");
  let idxKeyVal = category.checked;

  // let req = idxKey.openCursor(idxKeyVal);

  // debugger;
  res.onsuccess = function (e) {
    let cursor = res.result;
    if (cursor) {
      let key = cursor.primaryKey;
      let value = cursor.value;
      let cursorKey = cursor.key;
      cursor.continue();
      console.log("Items state", key, value, cursorKey);
    } else {
      console.log("Index empty");
    }
  };
}

function deleteItem(e) {
  let itemBox = e.target.closest(".item-list-container");
  itemBox.closest("span .title");
  itemBox.remove();
}
