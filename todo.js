
function insert(){
    let inputNewTask = document.getElementById("new-task");

    if (inputNewTask.value == ''){
        alert("Task is empty!");
        return;
    }

    let table1 = document.getElementById("table1");
    let row = table1.insertRow(2);
    let cell0 = row.insertCell(0); 
    let cell1 = row.insertCell(1);
    let cell2 = row.insertCell(2);

    let tick = document.createElement("INPUT");
    tick.type = "checkbox";
    tick.onclick = tickOff;

    let deleteButton = document.createElement("BUTTON");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = deleteTask;

    cell0.innerHTML = inputNewTask.value;
    cell1.appendChild(tick);
    cell2.appendChild(deleteButton);

    inputNewTask.value = '';
}


document.getElementById("new-task").addEventListener("keyup", function(event){
    if (event.keyCode === 13){
        event.preventDefault();
        document.getElementById("add").onclick();
    }
});


function deleteTask(){
    let rowIndex = this.parentNode.parentNode.rowIndex;
    let table = this.parentNode.parentNode.parentNode.parentNode;
    table.deleteRow(rowIndex);
}

function tickOff(){
    let table1 = document.getElementById("table1");
    let table2 = document.getElementById("table2");
    let rowIndex = this.parentNode.parentNode.rowIndex;
    table1.deleteRow(rowIndex);

    let row = table2.insertRow(1);

    let cell0 = row.insertCell(0);
    let cell1 = row.insertCell(1);
    let cell2 = row.insertCell(2);

    let deleteButton = document.createElement("BUTTON");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = deleteTask;

    let tick = document.createElement("INPUT");
    tick.id = "tick2";
    tick.type = "checkbox";
    tick.checked = true;
    tick.onclick = tickBack;

    cell0.innerHTML = this.parentNode.parentNode.cells[0].innerHTML;
    cell1.appendChild(tick);
    cell2.appendChild(deleteButton);
}

function tickBack(){
    let table1 = document.getElementById("table1");
    let table2 = document.getElementById("table2");
    let rowIndex = this.parentNode.parentNode.rowIndex;
    let content = table2.rows[rowIndex].cells[0].innerHTML;

    document.getElementById("new-task").value = content;
    document.getElementById("add").onclick();

    table2.deleteRow(rowIndex);
}