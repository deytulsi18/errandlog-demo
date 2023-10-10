const viewFormBtn = document.querySelector(".view-form-btn");
const container2 = document.querySelector(".container-2");
const container3 = document.querySelector(".container-3");

const postTitle = document.querySelector("#postTitle");
const postDesc = document.querySelector("#postDescription");
const postPriority = document.querySelector("#postPriority");
const submitBtn = document.querySelector(".submit-btn");

// function for xss protection
const escapeHtml = (str) => {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\//g, "&#x2F;");
};

const truncateString = (str, maxLength) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  } else {
    return str;
  }
};

const insertPostIntoHTMLDynamically = (title, desc, priority, id) => {
  const errandDiv = document.createElement("div");
  errandDiv.id = id;
  errandDiv.classList.add("errand");
  errandDiv.classList.add(`task-${priority}`);

  const postPriorityDiv = document.createElement("div");
  postPriorityDiv.classList.add("post-priority");
  postPriorityDiv.innerText = priority;

  const postTitleDiv = document.createElement("div");
  postTitleDiv.classList.add("post-title");

  const taskTitleHeading = document.createElement("h3");
  taskTitleHeading.innerText = title;

  const viewBtnDiv = document.createElement("div");
  viewBtnDiv.classList.add("view-btn");
  viewBtnDiv.classList.add("btn");
  viewBtnDiv.innerText = "View";

  const postDescDiv = document.createElement("div");
  postDescDiv.classList.add("post-desc");

  const taskDescPara = document.createElement("p");
  taskDescPara.innerText = desc;

  postDescDiv.appendChild(taskDescPara);
  postTitleDiv.appendChild(taskTitleHeading);
  postTitleDiv.appendChild(viewBtnDiv);

  errandDiv.appendChild(postPriorityDiv);
  errandDiv.appendChild(postTitleDiv);
  errandDiv.appendChild(postDescDiv);

  //   main.appendChild(errandDiv);
  container3.insertBefore(errandDiv, container3.firstChild);
};

const addEventListenerForPost = (taskTitle, taskDesc, taskPriority, taskId) => {
  document
    .querySelector(`#${taskId} .view-btn`)
    .addEventListener("click", () => {
      Swal.fire({
        icon: "info",
        title: `${taskTitle}`,
        // [Id: {taskId}]<br>`,
        text: `${taskDesc}`,
        html: `${taskDesc}<br><br><div class="swal-footer ${taskPriority}">This task is ${taskPriority}.</div>`,
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
              deleteTask(taskId);
              Swal.fire(
                "Deleted!",
                "Your file has been deleted.",
                "success"
              ).then(() => {
                document.querySelector(`#${taskId}`).remove();
              });
            }
          });
        }
      });
    });
};

const loadTasks = () => {
  // Get the tasks from localStorage and convert it to an array
  if (localStorage.getItem("tasks") !== null) {
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));

    // Loop through the tasks and add them to the list
    tasks.forEach((task) => {
      // This is for prevention of xss
      //...
      const dummyTaskTitleDiv = document.createElement("div");
      dummyTaskTitleDiv.innerHTML = task.title;
      const dummyTaskDescDiv = document.createElement("div");
      dummyTaskDescDiv.innerHTML = task.desc;
      const dummyTaskPriorityDiv = document.createElement("div");
      dummyTaskPriorityDiv.innerHTML = task.priority;
      const dummyTaskIdDiv = document.createElement("div");
      dummyTaskIdDiv.innerHTML = task.id;

      const taskTitle = escapeHtml(dummyTaskTitleDiv.textContent);
      const taskDesc = escapeHtml(dummyTaskDescDiv.textContent);
      const taskPriority = escapeHtml(dummyTaskPriorityDiv.textContent);
      const taskId = escapeHtml(dummyTaskIdDiv.textContent);

      dummyTaskTitleDiv.remove();
      dummyTaskDescDiv.remove();
      dummyTaskPriorityDiv.remove();
      dummyTaskIdDiv.remove();
      // ...

      // console.log(
      //   `Task:\nTitle: ${taskTitle}\nDesc: ${taskDesc}\nPriority: ${taskPriority}`
      // );

      insertPostIntoHTMLDynamically(taskTitle, taskDesc, taskPriority, taskId);

      addEventListenerForPost(taskTitle, taskDesc, taskPriority, taskId);
    });
    // });
  }
};

const addNewTask = (title, desc, priority, id) => {
  // This is for prevention of xss
  // ...
  const dummyTaskTitleDiv = document.createElement("div");
  dummyTaskTitleDiv.innerHTML = title;
  const dummyTaskDescDiv = document.createElement("div");
  dummyTaskDescDiv.innerHTML = desc;
  const dummyTaskPriorityDiv = document.createElement("div");
  dummyTaskPriorityDiv.innerHTML = priority;
  const dummyTaskIdDiv = document.createElement("div");
  dummyTaskIdDiv.innerHTML = id;

  const taskTitle = escapeHtml(
    truncateString(dummyTaskTitleDiv.textContent, 50)
  );
  const taskDesc = escapeHtml(
    truncateString(dummyTaskDescDiv.textContent, 500)
  );
  const taskPriority = escapeHtml(dummyTaskPriorityDiv.textContent);
  const taskId = escapeHtml(dummyTaskIdDiv.textContent);

  dummyTaskTitleDiv.remove();
  dummyTaskDescDiv.remove();
  dummyTaskPriorityDiv.remove();
  dummyTaskIdDiv.remove();
  // ...

  // const taskId = id;
  // const taskPriority = priority;
  // const taskTitle = truncateString(title, 50);
  // const taskDesc = truncateString(desc, 500);

  // add task to local storage
  localStorage.setItem(
    "tasks",
    JSON.stringify([
      ...JSON.parse(localStorage.getItem("tasks") || "[]"),
      {
        id: taskId,
        title: taskTitle,
        desc: taskDesc,
        priority: taskPriority,
      },
    ])
  );

  //   const myHTML = `
  //   <div id="${taskId}" class="errand task-${taskPriority}">
  //   <div class="post-priority">${taskPriority}</div>
  //   <div class="post-title">
  //     <h3>${taskTitle}</h3>
  //     <div class="view-btn btn">View</div>
  //   </div>
  //   <div class="post-desc">
  //     <p>${taskDesc}</p>
  //   </div>
  // </div>`;
  //   container3.innerHTML = myHTML + container3.innerHTML;

  insertPostIntoHTMLDynamically(taskTitle, taskDesc, taskPriority, taskId);

  addEventListenerForPost(taskTitle, taskDesc, taskPriority, taskId);
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

  // using nanoid to generate a unique id
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-";
  const nanoid = customAlphabet(alphabet, 21);
  const id = `t${nanoid()}`;

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

  const maxTaskLimit = 10;
  const taskWarningThreshold = 5;

  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks") || "[]"));

  // if (tasks.length > 0) {
  //   tasks.forEach((task) => {
  //     if (task.id == id) {
  //   console.log("duplicate found");
  //       Swal.fire({
  //         icon: "info",
  //         title: "Oops...",
  //         text: "This task already exists!",
  //       });
  //       return;
  //     }
  //   });
  //   console.log("all unique");
  // }

  if (tasks.length > maxTaskLimit - 1) {
    Swal.fire({
      icon: "warning",
      title: "Task productivity limit reached!",
      text: "You can have no more than 10 pending tasks. Complete the pending tasks to add more.",
    });
    viewFormBtn.click();
    return;
  } else {
    if (tasks.length > taskWarningThreshold - 1) {
      Swal.fire({
        icon: "warning",
        title: "Task productivity warning!",
        text: "It is suggested to have 5 or less tasks pending, however you can have upto 10 tasks pending for sustainable productivity.",
        showCloseButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Yes, add task",
        showDenyButton: true,
        denyButtonText: "cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          addNewTask(title, desc, priority, id);
          postTitle.value = "";
          postDesc.value = "";
          postPriority.value = "regular";

          Swal.fire({
            title: "Success",
            text: "Your task has been added!",
            icon: "success",
            confirmButtonColor: "#3085d6",
          }).then(() => {
            viewFormBtn.click();
          });
        }
      });
    } else {
      addNewTask(title, desc, priority, id);
      postTitle.value = "";
      postDesc.value = "";
      postPriority.value = "regular";

      Swal.fire({
        title: "Success",
        text: "Your task has been added!",
        icon: "success",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        viewFormBtn.click();
      });
    }
  }
});

viewFormBtn.addEventListener("click", () => {
  // console.log("working!");
  viewFormBtn.classList.toggle("active-view-form-btn");
  container2.classList.toggle("collapse-div");
});
