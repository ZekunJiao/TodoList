// localStorage.clear();   
// console.log(document.getElementById("html").innerHTML);
if (localStorage.getItem("changed") == "true"){
    document.getElementById("html").innerHTML = localStorage.getItem("page");
}
// console.log(document.getElementById("html").innerHTML);
function insert(){
    if (document.getElementById("new-task").value == ''){
        alert("Task is empty!");
        return;
    }

    let table1 = document.getElementById("table1");
    table1.innerHTML = "<div class='task-div' onmouseenter='pressed()' onmouseleave='unpressed()'><i class='fas fa-caret-down'></i><p class='text'>" + document.getElementById('new-task').value + 
    "</p><i id='tick' class='fas fa-check unchecked' onclick='tickOfftable1()'></i><i class='fas fa-trash-alt' onclick='deleteTask()'></i></div>"
     + table1.innerHTML;
    
    // let inputNewTask = document.getElementById("new-task");

    
    // let table1 = document.getElementById("table1");
    // let div = document.createElement("DIV");
    // table1.insertBefore(div, table1.firstChild);
    // let tick = document.createElement("I");
    // let text = document.createElement("P");
    // text.classList.add("text");
    // text.innerHTML = document.getElementById("new-task").value;

    // div.appendChild(text);
    // tick.id = "tick"
    // tick.classList.add("fas");
    // tick.classList.add("fa-check");
    // tick.classList.add("unchecked");
    // div.appendChild(tick);
    // tick.setAttribute("click", function() {
    //     tickOfftable1(tick);}
    // );
    // // tick.addEventListener("click", 
    // //     tickOfftable1
    // // );
    // console.log(tick);

    // let trash = document.createElement("I");
    // trash.classList.add("fas");
    // trash.classList.add("fa-trash-alt");
    // trash.onclick = deleteTask;

    
    // div.appendChild(tick);
    // div.appendChild(trash);
    // div.classList.add("task-div");

    document.getElementById("new-task").value = '';
    update();
    localStorage.setItem("page", document.getElementById("html").innerHTML);
    localStorage.setItem("changed", "true");
}


document.getElementById("remove-all-undone").onclick = removeAll;
document.getElementById("remove-all-finished").onclick = removeAll;

document.getElementById("new-task").addEventListener("keyup", function(event){
    if (event.keyCode === 13){
        event.preventDefault();
        document.getElementById("add").onclick();
    }
});

function pressed() {   
    let task = event.target;
    console.log(task);

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

function save(){
    localStorage.setItem("page", document.getElementById("html").innerHTML);
    localStorage.setItem("changed", "true");
    alert("a");
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
    update();
    localStorage.setItem("page", document.getElementById("html").innerHTML);
    localStorage.setItem("changed", "true");


}


function deleteTask(){
    let task = event.target.parentNode;
    let table = task.parentNode;

    if (table == table1)
        table1.removeChild(task);
    else 
        table2.removeChild(task);

    update();
    localStorage.setItem("page", document.getElementById("html").innerHTML);
    localStorage.setItem("changed", "true");

}

function tickOfftable1(){
    // alert("a");
    let table1 = document.getElementById("table1");
    let table2 = document.getElementById("table2");
    let task = event.target.parentNode;

    // a.parentNode.children[1].classList.remove("unchecked");
    // console.log(a.parentNode);

    // table1.removeChild(a.parentNode);  
    // table2.insertBefore(a.parentNode, table2.firstChild);

    if (task.parentNode == table1){
        task.children[2].classList.remove("unchecked");
        table1.removeChild(task);  
        table2.insertBefore(task, table2.firstChild);
    }
    else{
        task.children[2].classList.add("unchecked");

        table2.removeChild(task);  
        table1.insertBefore(task, table1.firstChild);
    }

    update();
    localStorage.setItem("page", document.getElementById("html").innerHTML);
    localStorage.setItem("changed", "true");
}


function update(){
    document.getElementById("undone-count").innerHTML = table1.children.length;
    document.getElementById("finished-count").innerHTML = table2.children.length;
}

