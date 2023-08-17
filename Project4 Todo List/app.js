let section = document.querySelector("section");
let add = document.querySelector(`button[type="submit"]`);

add.addEventListener("click", (e) => {
    e.preventDefault();

    // get input value
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDay = form.children[2].value;

    if (todoText === "") {
        alert("Please Enter some Text");
        return;
    }
    if (todoMonth === "") {
        alert("Please Enter Month");
        return;
    }
    if (todoDay === "") {
        alert("Please Enter Day");
        return;
    }

    // create a todo
    let todo = document.createElement("div");
    todo.classList.add("todo");

    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText;

    let time = document.createElement("p");
    time.classList.add("todo-item");
    time.innerText = todoMonth + "/" + todoDay;

    todo.appendChild(text);
    todo.appendChild(time);

    // create icons
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = `<i class="fas fa-check"></i>`;

    completeButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
    });

    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = `<i class="fas fa-trash"></i>`;

    trashButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.addEventListener("animationend", (e) => {
            todoItem.remove();

            // remove from local storage
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item, index) => {
                if (item.todoText === text) {
                    myListArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArray));
                }
            });
        });

        todoItem.style.animation = `scale-down 0.3s forwards`;
    });

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    todo.style.animation = `scale-up 0.3s forwards`;

    // create an object
    let myTodo = {
        todoText,
        todoMonth,
        todoDay,
    };

    // store data into an array of objects
    let myList = localStorage.getItem("list");
    if (myList === null) {
        localStorage.setItem("list", JSON.stringify([myTodo]));
    } else {
        let myListArray = JSON.parse(myList);
        console.log(myListArray);
        myListArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(myListArray));
    }

    // clear input
    form.children[0].value = "";
    form.children[1].value = "";
    form.children[2].value = "";

    section.appendChild(todo);
});

// load data
let myList = localStorage.getItem("list");
if (myList !== null) {
    let myListArray = JSON.parse(myList);
    myListArray.forEach((item) => {
        // create a todo
        let todo = document.createElement("div");
        todo.classList.add("todo");

        let text = document.createElement("p");
        text.classList.add("todo-text");
        text.innerText = item.todoText;

        let time = document.createElement("p");
        time.classList.add("todo-item");
        time.innerText = item.todoMonth + "/" + item.todoDay;

        todo.appendChild(text);
        todo.appendChild(time);

        // create icons
        let completeButton = document.createElement("button");
        completeButton.classList.add("complete");
        completeButton.innerHTML = `<i class="fas fa-check"></i>`;

        completeButton.addEventListener("click", (e) => {
            let todoItem = e.target.parentElement;
            todoItem.classList.toggle("done");
        });

        let trashButton = document.createElement("button");
        trashButton.classList.add("trash");
        trashButton.innerHTML = `<i class="fas fa-trash"></i>`;

        trashButton.addEventListener("click", (e) => {
            let todoItem = e.target.parentElement;
            todoItem.addEventListener("animationend", (e) => {
                todoItem.remove();

                // remove from local storage
                let text = todoItem.children[0].innerText;
                let myListArray = JSON.parse(localStorage.getItem("list"));
                myListArray.forEach((item, index) => {
                    if (item.todoText === text) {
                        myListArray.splice(index, 1);
                        localStorage.setItem("list", JSON.stringify(myListArray));
                    }
                });
            });

            todoItem.style.animation = `scale-down 0.3s forwards`;
        });

        todo.appendChild(completeButton);
        todo.appendChild(trashButton);

        section.appendChild(todo);
    });
}
