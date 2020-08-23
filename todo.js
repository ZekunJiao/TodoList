
function insert(){
    let inputNewTask = document.getElementById("new-task");

    if (inputNewTask.value == ''){
        alert("Task is empty!");
        return;
    }

    let tick = document.createElement("INPUT");
    tick.type = "checkbox";

    let removeButton = document.createElement("BUTTON");
    removeButton.innerHTML = "Delete";
    removeButton.onclick = removeTask;

    let table = document.getElementById("table");
    let row = table.insertRow(2);
    let cell1 = row.insertCell(0); 
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);

    cell1.innerHTML = inputNewTask.value;
    cell2.appendChild(tick);
    cell3.appendChild(removeButton);

    inputNewTask.value = '';
}


document.getElementById("new-task").addEventListener("keyup", function(event){
    if (event.keyCode === 13){
        event.preventDefault();
        document.getElementById("add").onclick();
    }
});


function removeTask(){
    let table = document.getElementById("table");
    table.deleteRow(this.parentNode.parentNode.rowIndex);
}
