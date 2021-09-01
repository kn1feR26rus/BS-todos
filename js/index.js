const input = document.getElementById("input");
const items = document.getElementById("items");
const addBtn = document.getElementById('add-btn');
const activeBtn = document.getElementById("active");
const archBtn = document.getElementById("arch");
const taske = document.querySelectorAll(".todo-item");
const timer = document.querySelector(".timer")

let showblArr = []
let tasks;
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem("tasks")); //check and get from local
let todosItem = [];
isNeedToShowComplited = true;
let toArchiveTime = 2;


class Task {
    constructor(id, descrip) {
        this.id = id;
        this.descrip = descrip;
        this.completed = false;
        this.await = false;
        this.leftSeconds = toArchiveTime;
    }
    formatSeconds() {
        if (!this.completed && this.await) {
            return this.leftSeconds;
        } else {
            return "";
        }
        
    }
}

const upLocal = () => {                                     //get from local
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

const creatItem = (task, index) => {
    return `
    <div class="todo-item ${(task.completed || task.await) ? 'checked' : 'unchecked' }" id="todo-item">
        <input onClick="completeTask(${index})" type="checkbox" class="checkbox" id="checkbox" ${(task.completed || task.await) ? 'checked' : ''}>
        <div id="timer-${task.id}" class="timer">${task.formatSeconds()}</div>
        <p class="text ${(task.completed || task.await) ? 'text_checked' : ''}" id="text_checked"> ${task.descrip} </p>
        <div class="buttons">
            <button class="buttons__edit"></button>
            <button onClick=deleteTask(${index}) class="buttons__delete"></button>
        </div>
    </div>
    `
}

const pushHtml = () => {
    showblArr = tasks.filter(task => filtered(task));
    items.innerHTML = "";
    if(showblArr.length > 0) {
        showblArr.forEach((item, index) => {
            items.innerHTML += creatItem(item, index);
            upLocal();
        });
        todosItem = document.querySelectorAll(".todo-item");
    }
}

const goTimer = () => {
    setInterval(() => {
        const pandingTasks = tasks.filter(task => task.await && !task.completed);
        pandingTasks.forEach((item, index) => {
            if (item.leftSeconds <= 0) {
                item.completed = true;
                item.await = false;
            } else {
                item.leftSeconds--
            }
        })
        pushHtml()
        console.log(pandingTasks);
    }, 1000);
    }
goTimer()

pushHtml();

const startTimer = (task) => {
    task.leftSeconds = toArchiveTime;
}

const cancelTimer = (task) => {
    console.log(task);
}

const completeTask = index => {
    let task = showblArr[index];
    let targetIndex = tasks.indexOf(task);
    // tasks[targetIndex].completed = !tasks[targetIndex].completed;
    if (task.completed) {
        tasks[targetIndex].completed = false;
    } else if (task.await) {
        tasks[targetIndex].await = false;
        cancelTimer(task)
    } else {
        tasks[targetIndex].await = true;
        startTimer(task);
        
    }
    upLocal();
    pushHtml();
}

const deleteTask = (index) => {
    let task = showblArr[index];
    let targetIndex = tasks.indexOf(task);
    tasks.splice(targetIndex, 1);
    pushHtml();
    upLocal();
}


function filtered(task) {
    if (isNeedToShowComplited) {
        return !task.completed
    } else {
        return task.completed 
    }
}

//1. complited, 2. !complited 3. !complited && await


activeBtn.addEventListener('click', () => {  //click and filter active
    isNeedToShowComplited = true;
    upLocal();
    pushHtml();
})

archBtn.addEventListener('click', () => {  //click and filter disactive
    isNeedToShowComplited = false;
    upLocal();
    pushHtml();
})

// function show()  
//         {  
//             $.ajax({  
//                 url: "index.html",  
//                 cache: false,  
//                 success: function(html){  
//                     $("#todo-item").html(html);  
//                 }  
//             });  
//         }  
//         $(document).ready(function(){  
//             show();  
//             setInterval('show()',1000);  
//         });  

const creatTask = (description) => {
    let id = Math.round(Math.random() * 1000000)
    console.log(id);
    return new Task(id, description)
    
}

// const ffff = new Task(-1,'description')
// ffff.formatSeconds()
// console.log(ffff.formatSeconds());

addBtn.addEventListener("click", () => {  //click btn and add task
    tasks.push(creatTask(input.value));
    pushHtml();
    upLocal();
    input.value = '';
})

// _____________________ code for videoJS _____________________________

// var player = videojs('my-video');
// const submitFile = document.querySelector('.submitFile')
// let file = document.querySelector('.file')
// let source = document.querySelector('.source').src


// function setNewEntry(entry) {
//     $('#my-video').html(entry);
// }

// submitFile.addEventListener('click', () => {
//     source = "//vjs.zencdn.net/v/oceans.mp4" 
//     console.log(source);
//     console.log(file.value);
// })