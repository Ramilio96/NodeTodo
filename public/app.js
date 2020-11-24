M.Tabs.init(document.querySelector(".tabs"));

const todoContainer = document.querySelector("#todo");

if (todoContainer) {
    todoContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("js-remove")) {
      let id = e.target.dataset.id;
    
      fetch(`/todos/remove/${id}`, {
        method: "delete",
      })
        .then((res) => res.json())
        .then((todo) => {
         
          if (todo.todos) { 
            const html = todo.todos
              .map((t) => {
                return `
                <div class="col s6 m7">
                <div class="card">
                  <div class="card-image">
                    <img src="${t.image}" alt="${t.name}">
                    <span class="card-title">${t.name}</span>
                  </div>
                   <div class="card-content">
                    <p>${t.description}</p>
                  </div>
                  <div class="card-action">
                    <a href="/todos/${t._id}/edit">Edit</a>
                    
                    <button class="btn btm-small js-remove" data-id="${t._id}">Delete</button>
                    
                  </div>
                </div>
              </div>
              `;
              })
              .join("");
            todoContainer.querySelector(".row").innerHTML = html;
          } else {
            todoContainer.innerHTML = "<p>No todos found!</p>";
          }
        });
    }
  });
}