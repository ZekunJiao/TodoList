// localStorage.clear();   
// console.log(document.getElementById("html").innerHTML);

// console.log(document.getElementById("html").innerHTML);
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

    table.insertBefore(taskDiv, table.firstChild);

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
    // console.log(undoneArray);
}

function deleteTask(){
    let task = event.target.parentNode;
    let table = task.parentNode;

    if (table == table1){
        table1.removeChild(task);
        undoneMap.delete(parseInt(task.id));
        localStorage.setItem("undoneMap", JSON.stringify(Array.from(undoneMap.entries())));
        
    }
    else {
        table2.removeChild(task);
        doneMap.delete(parseInt(task.id));
        localStorage.setItem("doneMap", JSON.stringify(Array.from(doneMap.entries())));
    }
    
    
    updateCount();
}

function tickOff(){
    // alert("a");
    let table1 = document.getElementById("table1");
    let table2 = document.getElementById("table2");
    let task = event.target.parentNode;
    let taskRep;

    if (task.parentNode == table1){
        task.children[2].classList.remove("unchecked");
        table1.removeChild(task);  
        table2.insertBefore(task, table2.firstChild);
        taskRep = undoneMap.get(parseInt(task.id));
        undoneMap.delete(parseInt(task.id));
        localStorage.setItem("undoneMap", JSON.stringify(Array.from(undoneMap.entries())));
        doneMap.set(taskRep.id, taskRep);
        localStorage.setItem("doneMap", JSON.stringify(Array.from(doneMap.entries())));
    }
    else{
        task.children[2].classList.add("unchecked");
        table2.removeChild(task);  
        table1.insertBefore(task, table1.firstChild);
        taskRep = doneMap.get(parseInt(task.id));
        doneMap.delete(parseInt(task.id));
        localStorage.setItem("doneMap", JSON.stringify(Array.from(doneMap.entries())));
        undoneMap.set(taskRep.id, taskRep);
        localStorage.setItem("undoneMap", JSON.stringify(Array.from(undoneMap.entries())));
    }
    updateCount();
    
}

function dropDown(){
    let caller = event.target;
    if (caller.classList.contains("fa-check") || caller.classList.contains("fa-trash-alt")){
        return;
    }

    if (caller.classList.contains("text") || caller.classList.contains("fa-caret-down")){
        caller = caller.parentNode;
    }
    
    // if (caller.nextSibling.classList.contains("not-drop-down")) {
    //     caller.nextSibling.classList.remove("not-drop-down");
    //     caller.nextSibling.classList.add("drop-down");
    // }

    // caller.nextSibling.classList.toggle("not-drop-down");
}


function pressed() {   
    let task = event.target;
    task.style.borderTop = "solid";
    task.style.borderLeft = "solid";
    task.style.borderBottom = "none";
    task.style.borderRight = "none";
    task.children[0].style.color = "blue";
}

function unpressed() {
    let task = event.target;
    task.style.borderTop = "none";
    task.style.borderLeft = "none";
    task.style.borderBottom = "solid";
    task.style.borderRight = "solid";
    task.children[0].style.color = "black";

}



function removeAll() {
    if (!confirm("Are you sure?")){
        return;
    }

    let table;
    
    if (this == document.getElementById("remove-all-undone")){
        table = document.getElementById("table1");
    }
    else {
        table = document.getElementById("table2");
    }

    // console.log(table.firstChild);
    // table.remove(table.lastChild);
    // console.log(table.firstChild);

    table.innerHTML = "";
    updateCount();
    localStorage.setItem("page", document.getElementById("html").innerHTML);
    localStorage.setItem("changed", "true");
}

function updateCount(){
    document.getElementById("undone-count").innerHTML = table1.children.length;
    document.getElementById("finished-count").innerHTML = table2.children.length;
}

