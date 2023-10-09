const newTaskBtn = document.querySelector(".new-task-btn");
const container2 = document.querySelector(".container-2");
const container3 = document.querySelector(".container-3");

const postTitle = document.querySelector("#postTitle");
const postDesc = document.querySelector("#postDescription");
const postPriority = document.querySelector("#postPriority");
const submitBtn = document.querySelector(".submit-btn");

const truncateString = (str, maxLength) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  } else {
    return str;
  }
};

const loadTasks = () => {
  // Get the tasks from localStorage and convert it to an array
  if (localStorage.getItem("tasks") !== null) {
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));

    // Loop through the tasks and add them to the list
    tasks.forEach((task) => {
      const taskTitle = task.title;
      const taskDesc = task.desc;
      const taskPriority = task.priority;
      const taskId = task.id;

      // console.log(
      //   `Task:\nTitle: ${taskTitle}\nDesc: ${taskDesc}\nPriority: ${taskPriority}`
      // );

      const myHTML = `
        <div class="${taskId} errand task-${taskPriority}">
          <div class="post-priority">${taskPriority}</div>
          <div class="post-title">
            <h3>${taskTitle}</h3>
            <div class="view-btn btn">View</div>
          </div>
          <div class="post-desc">
            <p>${taskDesc}</p>
          </div>
        </div>`;
      container3.innerHTML = myHTML + container3.innerHTML;
    });

    document.querySelectorAll(".view-btn").forEach((elem) => {
      const parentOfParent = elem.parentElement.parentElement;
      // console.log(parentOfParent);
      elem.addEventListener("click", () => {
        const currTaskTitle = parentOfParent
          .querySelector(".post-title")
          .querySelector("h3").innerText;
        const currTaskDesc = parentOfParent
          .querySelector(".post-desc")
          .querySelector("p").innerText;
        const classNamesOfElem = parentOfParent.className;
        const currTaskId = classNamesOfElem.slice(
          0,
          classNamesOfElem.indexOf(" ", 0)
        );

        Swal.fire({
          icon: "warning",
          title: `${currTaskTitle}`,
          // [Id: ${currTaskId}]<br>`,
          text: `${currTaskDesc}`,
          showCloseButton: true,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Completed",
          showCancelButton: true,
          cancelButtonText: "Exit",
          showDenyButton: true,
          denyButtonText: "Delete",
          denyButtonColor: "#d33",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              icon: "success",
              title: "Task Completed",
              text: "You have sucessfully completed the Task.",
            });
          } else if (result.isDenied) {
            Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#3085d6",
              confirmButtonText: "Yes, delete it!",
            }).then((result) => {
              if (result.isConfirmed) {
                // console.log(currTaskId);
                deleteTask(currTaskId);
                Swal.fire(
                  "Deleted!",
                  "Your file has been deleted.",
                  "success"
                ).then(() => {
                  location.reload();
                });
              }
            });
          }
        });
      });
    });
  }
};

const addNewTask = (title, desc, priority, id) => {
  const taskId = id;
  const taskTitle = truncateString(title, 50);
  const taskDesc = truncateString(desc, 500);

  // add task to local storage
  localStorage.setItem(
    "tasks",
    JSON.stringify([
      ...JSON.parse(localStorage.getItem("tasks") || "[]"),
      {
        id: taskId,
        title: taskTitle,
        desc: taskDesc,
        priority: priority,
      },
    ])
  );

  const myHTML = `
        <div class="${taskId} errand task-${priority}">
          <div class="post-priority">${priority}</div>
          <div class="post-title">
            <h3>${taskTitle}</h3>
            <div class="view-btn btn">View</div>
          </div>
          <div class="post-desc">
            <p>${taskDesc}</p>
          </div>
        </div>`;
  container3.innerHTML = myHTML + container3.innerHTML;
};

const deleteTask = (taskId) => {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach((task) => {
    if (task.id === taskId) {
      // delete task
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const title = postTitle.value;
  const desc = postDesc.value;
  const priority = postPriority.value;

  if (title == "" || desc == "") {
    // console.log("Fields cannot be empty.");
    Swal.fire({
      title: "Invalid input!",
      text: "Fields cannot be empty.",
      icon: "info",
      confirmButtonColor: "#3085d6",
    });
    return;
  } else if (priority == "") {
    // console.log("Select a priority for your task.");
    Swal.fire({
      title: "Invalid input!",
      text: "Select a priority for your task.",
      icon: "info",
      confirmButtonColor: "#3085d6",
    });
    return;
  }

  // console.log(`Task:\nTitle: ${title}\nDesc: ${desc}\nPriority: ${priority}`);

  // using nanoid to generate a unique id
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 10);
  const taskId = nanoid();

  // let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));

  // tasks.forEach((task) => {
  //   if (task.id == taskId) {
  //     Swal.fire({
  //       icon: "info",
  //       title: "Oops...",
  //       text: "This task already exists!",
  //     });
  //     return;
  //   }
  // });

  addNewTask(title, desc, priority, taskId);

  postTitle.value = "";
  postDesc.value = "";
  postPriority.value = "";
  container2.classList.toggle("collapse-div");

  Swal.fire({
    title: "Success",
    text: "Your task has been added!",
    icon: "success",
    confirmButtonColor: "#3085d6",
  }).then(() => {
    location.reload();
  });
});

newTaskBtn.addEventListener("click", () => {
  // console.log("working!");
  newTaskBtn.classList.toggle("active-new-task-btn");
  container2.classList.toggle("collapse-div");
});
