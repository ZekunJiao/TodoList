    else{
        task.children[1].classList.add("unchecked");

        table2.removeChild(task);  
        table1.insertBefore(task, table1.firstChild);
    }