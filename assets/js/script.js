const viewFormBtn = document.querySelector(".view-form-btn");
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
        <div id="t${taskId}" class="errand task-${taskPriority}">
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

    // Swal.fire("sucess", "dom content loaded").then(() => {
    tasks.forEach((task) => {
      const taskTitle = task.title;
      const taskDesc = task.desc;
      const taskPriority = task.priority;
      const taskId = task.id;

      document
        .querySelector(`#t${taskId} .view-btn`)
        .addEventListener("click", () => {
          // console.log(`t${taskId}`);
          Swal.fire({
            icon: "info",
            title: `${taskTitle}`,
            // [Id: t${taskId}]<br>`,
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
                  // console.log(=taskId);
                  deleteTask(taskId);
                  Swal.fire(
                    "Deleted!",
                    "Your file has been deleted.",
                    "success"
                  ).then(() => {
                    document.querySelector(`#t${taskId}`).remove();
                    // console.log(`Task t${taskId} is removed`);
                  });
                }
              });
            }
          });
        });
    });
    // });
  }
};

const addNewTask = (title, desc, priority, id) => {
  const taskId = id;
  const taskPriority = priority;
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
        priority: taskPriority,
      },
    ])
  );

  const myHTML = `
        <div id="t${taskId}" class="errand task-${priority}">
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
//   document
//     .querySelector(`#t${taskId} .view-btn`)
//     .addEventListener("click", () => {
//       Swal.fire({
//         icon: "info",
//         title: `${taskTitle}`,
//         // [Id: t${taskId}]<br>`,
//         text: `${taskDesc}`,
//         html: `${taskDesc}<br><br><div class="swal-footer ${taskPriority}">This task is ${taskPriority}.</div>`,
//         showCloseButton: true,
//         confirmButtonColor: "#3085d6",
//         confirmButtonText: "Completed",
//         showCancelButton: true,
//         cancelButtonText: "Exit",
//         showDenyButton: true,
//         denyButtonText: "Delete",
//         denyButtonColor: "#d33",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           Swal.fire({
//             icon: "success",
//             title: "Task Completed",
//             text: "You have sucessfully completed the Task.",
//           });
//         } else if (result.isDenied) {
//           Swal.fire({
//             title: "Are you sure?",
//             text: "You won't be able to revert this!",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#d33",
//             cancelButtonColor: "#3085d6",
//             confirmButtonText: "Yes, delete it!",
//           }).then((result) => {
//             if (result.isConfirmed) {
//               deleteTask(taskId);
//               Swal.fire(
//                 "Deleted!",
//                 "Your file has been deleted.",
//                 "success"
//               ).then(() => {
//                 document.querySelector(`#t${taskId}`).remove();
//               });
//             }
//           });
//         }
//       });
//     });
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
  const id = nanoid();

  console.log(id);

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
            location.reload();
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
        location.reload();
      });
    }
  }
});

viewFormBtn.addEventListener("click", () => {
  // console.log("working!");
  viewFormBtn.classList.toggle("active-view-form-btn");
  container2.classList.toggle("collapse-div");
});
