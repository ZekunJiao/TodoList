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
    insert(value.name, value.id, false, value.desc);
    console.log(value.desc);
}

for (let value of doneMap.values()) {
    insert(value.name, value.id, true, value.desc);
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
            localStorage.setItem("undoneMap", JSON.stringify(Array.from(undoneMap.entries())));
        }
        else{
            doneMap.get(parseInt(taskDiv.id)).desc = descText.value;
            localStorage.setItem("doneMap", JSON.stringify(Array.from(doneMap.entries())));
        }
    });
    descText.onchange = saveDesc;
    descText.value = desc;
    descDiv.appendChild(descText);
    descDiv.appendChild(cross);

    let bigDiv = document.createElement("DIV");
    bigDiv.appendChild(taskDiv);
    bigDiv.appendChild(descDiv);
    

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
    // console.log(task);
    if (task.parentNode.parentNode == table1){
        undoneMap.get(parseInt(task.id)).desc = textField.value;
        localStorage.setItem("undoneMap", JSON.stringify(Array.from(undoneMap.entries())));
    }
    else{
        doneMap.get(parseInt(task.id)).desc = textField.value;
        localStorage.setItem("doneMap", JSON.stringify(Array.from(doneMap.entries())));

    }
}

