
function insert(){
    let inputNewTask = document.getElementById("new-task");

    if (inputNewTask.value == ''){
        alert("Task is empty!");
        return;
    }

    let table1 = document.getElementById("table1");

    let tick = document.createElement("I");
    tick.classList.add("fas");
    tick.classList.add("fa-check");
    tick.classList.add("unchecked")  
    tick.onclick = tickOff;

    let trash = document.createElement("I");
    trash.classList.add("fas");
    trash.classList.add("fa-trash-alt");
    trash.onclick = deleteTask;

    let text = document.createElement("P");
    text.classList.add("text");
    text.innerHTML = document.getElementById("new-task").value;

    let div = document.createElement("DIV");
    div.appendChild(text);
    div.appendChild(tick);
    div.appendChild(trash);
    div.classList.add("task-div");

    table1.insertBefore(div, table1.firstChild);

    inputNewTask.value = '';

}


document.getElementById("new-task").addEventListener("keyup", function(event){
    if (event.keyCode === 13){
        event.preventDefault();
        document.getElementById("add").onclick();
    }
});


function deleteTask(){
    let table = this.parentNode.parentNode;
    let task = this.parentNode;
    if (table == table1)
        table1.removeChild(task);
    else 
        table2.removeChild(task);
}

function tickOff(){
    let table1 = document.getElementById("table1");
    let table2 = document.getElementById("table2");

    let task = this.parentNode;

    if (task.parentNode == table1){
        task.children[1].classList.remove("unchecked");
        table1.removeChild(task);  
        table2.insertBefore(task, table2.firstChild);
    }
    else{
        task.children[1].classList.add("unchecked");

        table2.removeChild(task);  
        table1.insertBefore(task, table1.firstChild);
    }
}

function update(){
    
}

