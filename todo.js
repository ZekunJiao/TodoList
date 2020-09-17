// localStorage.clear();   
let undoneMap = new Map([]);
let doneMap = new Map([]);
let listMap = new Map([]);
let currentListId;

if (localStorage.getItem("listMap")){
    listMap = new Map(JSON.parse(localStorage.getItem("listMap")));
}

for (let [key, value] of listMap.entries()) {
    insertList(value, key);
}

document.getElementById("new-list-input").addEventListener("keyup", function(){
    if (event.keyCode === 13){
        event.preventDefault();
        document.getElementById("new-list-btn").onclick();
    }
})

document.getElementById("new-list-input").placeholder = "new list";

document.getElementById("new-list-input").addEventListener("focus", function(){
    event.target.placeholder = "";
})

document.getElementById("new-list-input").addEventListener("blur", function(){
    event.target.placeholder = "new list";
})

document.getElementById("add").onclick = saveAdd;
table1 = document.getElementById("table1");
document.getElementById("remove-all-undone").onclick = removeAll;
document.getElementById("remove-all-finished").onclick = removeAll;

document.getElementById("new-task").addEventListener("keyup", function(){
    if (event.keyCode === 13){
        event.preventDefault();
        document.getElementById("add").onclick();
    }
});

if (document.getElementById("side-bar").children.length > 2){
    currentListId = document.getElementById("side-bar").children[2].firstChild.id;
    load(document.getElementById("side-bar").children[2].firstChild.id);
}
if (!currentListId){
    document.getElementById("container2").style.display = "none";
    document.getElementById("list-name").innerHTML = "Choose or create a list!"
}

function load(listId){
    document.getElementById("container2").style.removeProperty("display");

    if (currentListId){
        document.getElementById(currentListId).parentNode.style.background = "transparent";
    }

    undoneMap = new Map([]);
    doneMap = new Map([]);
    currentListId = listId;
    document.getElementById(currentListId).parentNode.style.background = "lightblue";

    let listName = document.getElementById(listId).innerHTML;
    document.getElementById("list-name").innerHTML = listName;
    document.getElementById("table1").innerHTML = "";
    document.getElementById("table2").innerHTML = "";

    if (localStorage.getItem("undoneMap" + listId)){
        undoneMap = new Map(JSON.parse(localStorage.getItem("undoneMap" + listId)));
    }


    if (localStorage.getItem("doneMap" + listId)){
        doneMap = new Map(JSON.parse(localStorage.getItem("doneMap" + listId)));
    }

    for (let value of undoneMap.values()) {
        insert(value.name, value.id, false, value.desc);
    }

    for (let value of doneMap.values()) {
        insert(value.name, value.id, true, value.desc);
    }


}

function insert(name, id, done, desc){
    let table;
    if (!done){
        table = document.getElementById("table1");
    }
    else {
        table = document.getElementById("table2");
    }

    let taskDiv = document.createElement("DIV");
    let dropDown = document.createElement("I");
    let tick = document.createElement("I");
    let text = document.createElement("P");
    let trash = document.createElement("I");

    dropDown.classList.add("fas");
    dropDown.classList.add("fa-caret-down");
    dropDown.onmousedown = taskPressed;
    dropDown.onmouseup = taskUnpressed;


    tick.classList.add("fas");
    tick.classList.add("fa-check");
    if (!done)
        tick.classList.add("unchecked");
    else 
        tick.classList.add("checked");
    tick.onclick = tickOff;
    text.classList.add("text");
    text.innerHTML = name;
    trash.classList.add("fas");
    trash.classList.add("fa-trash-alt");
    trash.onclick = deleteTask;

    taskDiv.classList.add("task-div");
    taskDiv.id = id;
    taskDiv.appendChild(dropDown);
    taskDiv.appendChild(text);
    taskDiv.appendChild(tick);
    taskDiv.appendChild(trash);

    let descDiv = document.createElement("DIV");
    let descText = document.createElement("TEXTAREA");
    let cross = document.createElement("I");

    descText.classList.add("desc-text");
    cross.classList.add("fas");
    cross.classList.add("fa-times");
    cross.addEventListener("click", function(){
        descText.value = "";
        if (!done){
            undoneMap.get(parseInt(taskDiv.id)).desc = descText.value;
            localStorage.setItem("undoneMap" + currentListId, JSON.stringify(Array.from(undoneMap.entries())));
        }
        else{
            doneMap.get(parseInt(taskDiv.id)).desc = descText.value;
            localStorage.setItem("doneMap" + currentListId, JSON.stringify(Array.from(doneMap.entries())));
        }
    });
    descText.onchange = saveDesc;
    descText.value = desc;
    descDiv.appendChild(descText);
    descDiv.appendChild(cross);

    let bigDiv = document.createElement("DIV");
    bigDiv.appendChild(taskDiv);
    bigDiv.appendChild(descDiv);
    bigDiv.setAttribute("listId", currentListId);

    table.insertBefore(bigDiv, table.firstChild);

    descDiv.classList.add("not-show");
    descDiv.value = "a";

    document.getElementById("new-task").value = '';
    document.getElementById("new-task").focus();
    updateCount(); 

}

function saveAdd(){
    if (document.getElementById("new-task").value == ''){
        alert("Task is empty!");
        return;
    }

    let taskName = document.getElementById("new-task").value;

    const taskRep = {
        id: Date.now(),
        name: taskName,
        // done: false
        desc: ""
    };

    insert(taskName, taskRep.id, false, taskRep.desc);

    undoneMap.set(taskRep.id, taskRep);
    localStorage.setItem("undoneMap" + currentListId, JSON.stringify(Array.from(undoneMap.entries())));
}

function deleteTask(){
    let task = event.target.parentNode.parentNode;
    let table = task.parentNode;

    if (table == table1){
        table1.removeChild(task);
        undoneMap.delete(parseInt(task.children[0].id));
        localStorage.setItem("undoneMap" + currentListId, JSON.stringify(Array.from(undoneMap.entries())));
        
    }
    else {
        table2.removeChild(task);
        doneMap.delete(parseInt(task.children[0].id));
        localStorage.setItem("doneMap" + currentListId, JSON.stringify(Array.from(doneMap.entries())));
    }
    
    updateCount();
}

function tickOff(){
    let table1 = document.getElementById("table1");
    let table2 = document.getElementById("table2");
    let bigTask = event.target.parentNode.parentNode;
    let task = bigTask.children[0];
    let taskRep;

    if (bigTask.parentNode == table1){
        task.children[2].classList.remove("unchecked");
        table1.removeChild(bigTask);  
        table2.insertBefore(bigTask, table2.firstChild);
        taskRep = undoneMap.get(parseInt(task.id));
        undoneMap.delete(parseInt(task.id));
        localStorage.setItem("undoneMap" + currentListId, JSON.stringify(Array.from(undoneMap.entries())));
        doneMap.set(taskRep.id, taskRep);
        localStorage.setItem("doneMap" + currentListId, JSON.stringify(Array.from(doneMap.entries())));
    }
    else{
        task.children[2].classList.add("unchecked");
        table2.removeChild(bigTask);  
        table1.insertBefore(bigTask, table1.firstChild);
        taskRep = doneMap.get(parseInt(task.id));
        doneMap.delete(parseInt(task.id));
        localStorage.setItem("doneMap" + currentListId, JSON.stringify(Array.from(doneMap.entries())));
        undoneMap.set(taskRep.id, taskRep);
        localStorage.setItem("undoneMap" + currentListId, JSON.stringify(Array.from(undoneMap.entries())));
    }

    updateCount();   
}

function dropDown(){
    event.target.parentNode.nextSibling.classList.toggle("not-show");
    event.preventDefault();
    let descDiv = event.target.parentNode.nextSibling;
    descDiv.children[0].focus();
}

function removeAll() {

    if (!confirm("Are you sure?")){
        return;
    }

    let table;
    let map;
    
    if (this == document.getElementById("remove-all-undone")){
        table = document.getElementById("table1");
        undoneMap.clear();
        localStorage.removeItem("undoneMap");
    }
    else {
        table = document.getElementById("table2");
        doneMap.clear();
        localStorage.removeItem("doneMap");
    }

    table.innerHTML = "";
    updateCount();
    
}

function updateCount(){
    document.getElementById("undone-count").innerHTML = table1.children.length;
    document.getElementById("finished-count").innerHTML = table2.children.length;
}

function taskPressed() {
    let task = event.target.parentNode;
    task.classList.toggle("pressed");
    dropDown()
}

function taskUnpressed() {
    let task = event.target.parentNode;
    task.classList.toggle("pressed");
}

function saveDesc(){
    let textField = event.target;
    let task = textField.parentNode.parentNode.children[0];
    if (task.parentNode.parentNode == table1){
        undoneMap.get(parseInt(task.id)).desc = textField.value;
        localStorage.setItem("undoneMap" + currentListId, JSON.stringify(Array.from(undoneMap.entries())));
    }
    else{
        doneMap.get(parseInt(task.id)).desc = textField.value;
        localStorage.setItem("doneMap" + currentListId, JSON.stringify(Array.from(doneMap.entries())));

    }
}

function newList() {
    if (document.getElementById("new-list-input").value == ""){
        alert("list name cant be empty");
         return;
    }
    listName = document.getElementById("new-list-input").value;
    listId = Date.now().toString();
    insertList(listName, listId);
    listMap.set(listId, listName);
    localStorage.setItem("listMap", JSON.stringify(Array.from(listMap.entries())));
}

function insertList(listName, listId){
    sideBar = document.getElementById("side-bar");

    listElement = document.createElement("P");
    listElement.innerHTML = listName;
    listElement.id = listId;
    listElement.classList.add("list-element");
    listElement.addEventListener("click", function(){
        load(event.target.id);
    });


    listDeleteBtn = document.createElement("I");
    listDeleteBtn.classList.add("fas");
    listDeleteBtn.classList.add("fa-trash-alt");
    listDeleteBtn.addEventListener("click", function(){
        deleteList();
    })

    listDiv = document.createElement("DIV");
    listDiv.appendChild(listElement);
    listDiv.appendChild(listDeleteBtn);
    listDiv.classList.add("list-div");

    listElement.parentNode.addEventListener("mouseenter", function(){
        if (currentListId != event.target.firstChild.id)
            event.target.style.background = "rgb(220, 248, 250)";
    });
    listElement.parentNode.addEventListener("mouseleave", function(){
        if (currentListId != event.target.firstChild.id)
            event.target.style.removeProperty("background");
    });

    sideBar.appendChild(listDiv);
    document.getElementById("new-list-input").value = "";
    document.getElementById("new-task").focus();
}

function deleteList() {
    listId = event.target.parentNode.firstChild.id;
    document.getElementById("side-bar").removeChild(event.target.parentNode);
    listMap.delete(listId);
    localStorage.setItem("listMap", JSON.stringify(Array.from(listMap.entries())));

    if(document.getElementById("side-bar").children.length <= 2){
        currentListId = null;
        document.getElementById("container2").style.display = "none";
        document.getElementById("list-name").innerHTML = "Choose or create a list!"
    }
    else if (listId == currentListId){
        currentListId = document.getElementById("side-bar").children[2].firstChild.id;
        load(currentListId);
    }
}
