// localStorage.clear();   
let undoneMap = new Map([]);
let doneMap = new Map([]);

if (localStorage.getItem("undoneMap")){
    undoneMap = new Map(JSON.parse(localStorage.getItem("undoneMap")));
}

if (localStorage.getItem("doneMap")){
    doneMap = new Map(JSON.parse(localStorage.getItem("doneMap")));
}

for (let value of undoneMap.values()) {
    insert(value.name, value.id, false);
}

for (let value of doneMap.values()) {
    insert(value.name, value.id, true);
}

table1 = document.getElementById("table1");
document.getElementById("remove-all-undone").onclick = removeAll;
document.getElementById("remove-all-finished").onclick = removeAll;

document.getElementById("new-task").addEventListener("keyup", function(event){
    if (event.keyCode === 13){
        event.preventDefault();
        document.getElementById("add").onclick();
    }
});

function insert(name, id, done){
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

    let bigDiv = document.createElement("DIV");
    let uTaskDiv = document.createElement("DIV");

    bigDiv.appendChild(taskDiv);
    bigDiv.appendChild(uTaskDiv);
    table.insertBefore(bigDiv, table.firstChild);

    uTaskDiv.classList.add("not-show");
    uTaskDiv.innerHTML = "a";

    document.getElementById("new-task").value = '';
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
        done: false
    };

    insert(taskName, taskRep.id, false);

    undoneMap.set(taskRep.id, taskRep);
    localStorage.setItem("undoneMap", JSON.stringify(Array.from(undoneMap.entries())));
}

function deleteTask(){
    let task = event.target.parentNode.parentNode;
    let table = task.parentNode;

    if (table == table1){
        table1.removeChild(task);
        undoneMap.delete(parseInt(task.children[0].id));
        localStorage.setItem("undoneMap", JSON.stringify(Array.from(undoneMap.entries())));
        
    }
    else {
        table2.removeChild(task);
        doneMap.delete(parseInt(task.children[0].id));
        localStorage.setItem("doneMap", JSON.stringify(Array.from(doneMap.entries())));
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
        localStorage.setItem("undoneMap", JSON.stringify(Array.from(undoneMap.entries())));
        doneMap.set(taskRep.id, taskRep);
        localStorage.setItem("doneMap", JSON.stringify(Array.from(doneMap.entries())));
    }
    else{
        task.children[2].classList.add("unchecked");
        table2.removeChild(bigTask);  
        table1.insertBefore(bigTask, table1.firstChild);
        taskRep = doneMap.get(parseInt(task.id));
        doneMap.delete(parseInt(task.id));
        localStorage.setItem("doneMap", JSON.stringify(Array.from(doneMap.entries())));
        undoneMap.set(taskRep.id, taskRep);
        localStorage.setItem("undoneMap", JSON.stringify(Array.from(undoneMap.entries())));
    }

    updateCount();   
}

function dropDown(){
    uTaskShow();
    let caller = event.target.nextSibling;
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

function uTaskShow() {
    event.target.parentNode.nextSibling.classList.toggle("not-show");
}

