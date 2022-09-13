// * ~~~~~~~~~~~~~~~~~~~ Api ~~~~~~~~~~~~~~~~~~~
const Api = (() => {
  // set up API routes for the backend
  const baseUrl = "http://localhost:3000/todos";

  // logic to fetch the todos from the backend
  const getTodos = () =>
    fetch([baseUrl].join("/")).then((response) => response.json());

  // logic to delete a todo from backend based on the ID
  const deleteTodo = (id) =>
    fetch([baseUrl, id].join("/"), {
      method: "DELETE",
    });

  // logic to add a todo to the the backend
  const addTodo = (todo) =>
    fetch([baseUrl].join("/"), {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));

  const Setfalsecompleted = (id) =>
    fetch([baseUrl, id].join("/"), {
      method: "PATCH",
      body: JSON.stringify({
        completed: false,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((response) => response.json());
  const SetTruecompleted = (id) =>
    fetch([baseUrl, id].join("/"), {
      method: "PATCH",
      body: JSON.stringify({
        completed: true,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));

  const updateTodo = (todo, id) =>
    fetch([baseUrl, id].join("/"), {
      method: "PATCH",
      body: JSON.stringify({
        completed: todo.completed,
        title: todo.title,
        id: id,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));

  // return functions so that they be called
  return {
    getTodos,
    deleteTodo,
    addTodo,
    Setfalsecompleted,
    SetTruecompleted,
    updateTodo,
  };
})();
// * ~~~~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~~~~

// set up the dom elements
const View = (() => {
  const domstr = {
    todocontainer: "#todolist_container",
    completedcontainer: "#completed_container",
    inputbox: ".todolist__input",
  };

  // set the InnerHTML based on the template
  const render = (ele, tmp) => {
    ele.innerHTML = tmp;
  };

  // create the template ; for each todo, structure the HTML
  const createTmp = (arr) => {
    let tmp = "";
    arr.forEach((todo) => {
      tmp += `
        <li class = "eachli">
        <div class="leftbuttons">
          <span class="lefttext" id = ${todo.id}>${todo.id}-${todo.title}</span>

          <input class="todolist__edit" id="${todo.id}" />

          <button class="arrow" id="${todo.id}">
          <svg fill="white" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowForwardIcon" aria-label="fontSize small"><path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>
          </button>
           <button class="deletebtn" id="${todo.id}">
           <svg fill="white" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
           </button>
           <button class="edit" id="${todo.id}">
           
            <svg fill="white" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
           
           </button>
          
          </div>
      `;
    });
    return tmp;
  };

  const tmpcompleted = (arr) => {
    let tmp = "";
    arr.forEach((todo) => {
      tmp += `
        <li class = "eachli">
        <button class="arrow" id="${todo.id}">
        
        <svg fill="white" stroke=none focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowBackIcon" aria-label="fontSize small"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg> 
        
        </button>
          <span class="lefttext2" id = ${todo.id}>${todo.id}-${todo.title}</span>
          <input class="todolist_completed" id="toggleinput2" />


          <div class="rightbuttons">
           <button class="edit" id="${todo.id}">
          <svg fill="white" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
           </button>
           <button class="deletebtn" id="${todo.id}">
          <svg fill="white" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
           </button>
           </div>
      `;
    });
    return tmp;
  };

  // return render methods to be used elsewhere
  return {
    render,
    createTmp,
    tmpcompleted,
    domstr,
  };
})();

// * ~~~~~~~~~~~~~~~~~~~ Model ~~~~~~~~~~~~~~~~~~~

const Model = ((api, view) => {
  const {
    getTodos,
    deleteTodo,
    addTodo,
    SetTruecompleted,
    Setfalsecompleted,
    updateTodo,
  } = api;

  // template for each Todo
  class Todo {
    constructor(title) {
      this.userId = 2;
      this.completed = false;
      this.title = title;
    }
  }

  class Edittruetodo {
    constructor(title) {
      this.userId = 2;
      this.completed = true;
      this.title = title;
    }
  }

  // create the state to store the todos and have functions to access and manipulate
  class State {
    #todolist = [];
    #completedlist = [];

    get todolist() {
      return this.#todolist;
    }

    get completedlist() {
      return this.#completedlist;
    }

    set todolist(newtodolist) {
      this.#todolist = newtodolist;
      const todocontainer = document.querySelector(view.domstr.todocontainer);
      const tmp = view.createTmp(this.#todolist);
      view.render(todocontainer, tmp);
    }
    set completedlist(newtodolist) {
      this.#completedlist = newtodolist;
      const todocontain = document.querySelector(
        view.domstr.completedcontainer
      );
      const tmps = view.tmpcompleted(this.#completedlist);
      view.render(todocontain, tmps);
    }
  }

  // make local state accessible in controller
  return {
    getTodos,
    deleteTodo,
    addTodo,
    SetTruecompleted,
    Setfalsecompleted,
    updateTodo,
    State,
    Todo,
    Edittruetodo,
  };
})(Api, View);

// * ~~~~~~~~~~~~~~~~~~~ Controller ~~~~~~~~~~~~~~~~~~~
const Controller = ((model, view) => {
  // create instance of state
  const state = new model.State();

  // listen for delete event and then update state
  const deleteTodo = () => {
    const todocontainer = document.querySelector(view.domstr.todocontainer);
    todocontainer.addEventListener("click", (event) => {
      if (event.target.className === "deletebtn") {
        state.todolist = state.todolist.filter(
          (todo) => +todo.id !== +event.target.id
        );
        model.deleteTodo(event.target.id);
      }
    });
  };

  const deletecompleteTodo = () => {
    const todocontainer = document.querySelector(
      view.domstr.completedcontainer
    );
    todocontainer.addEventListener("click", (event) => {
      if (event.target.className === "deletebtn") {
        state.completedlist = state.completedlist.filter(
          (todo) => +todo.id !== +event.target.id
        );
        model.deleteTodo(event.target.id);
      }
    });
  };

  // listen for enter key and then update state with new Todo
  const addTodo = () => {
    const inputbox = document.querySelector(view.domstr.inputbox);
    const submitform = document.getElementById("myform");
    submitform.addEventListener("submit", (event) => {
      const todo = new model.Todo(
        document.getElementById("myform").elements[0].value
      );
      model.addTodo(todo).then((todofromBE) => {
        state.todolist = [todofromBE, ...state.todolist];
      });
      event.target.value = "";
    });

    inputbox.addEventListener("keyup", (event) => {
      if (event.key === "Enter" && event.target.value.trim() !== "") {
        const todo = new model.Todo(event.target.value);
        model.addTodo(todo).then((todofromBE) => {
          state.todolist = [todofromBE, ...state.todolist];
        });
        event.target.value = "";
      }
    });
  };
  // move to right
  const setCompleted = () => {
    const todocontainer = document.querySelector(view.domstr.todocontainer);
    todocontainer.addEventListener("click", (event) => {
      if (event.target.className === "arrow") {
        state.todolist = state.todolist.filter(
          (todo) => +todo.id !== +event.target.id
        );

        model.SetTruecompleted(event.target.id).then((todofromBE) => {
          state.completedlist = [todofromBE, ...state.completedlist];
          console.log(state.completedlist);
        });
      }
    });
  };
  // move to left
  const setUnCompleted = () => {
    const todocontainer = document.querySelector(
      view.domstr.completedcontainer
    );
    todocontainer.addEventListener("click", (event) => {
      if (event.target.className === "arrow") {
        state.todolist = state.todolist.filter(
          (todo) => +todo.id !== +event.target.id
        );

        model.Setfalsecompleted(event.target.id).then((todofromBE) => {
          state.todolist = [todofromBE, ...state.completedlist];
          console.log(state.completedlist);
        });
      }
    });
  };

  const editthetaskcomplete = () => {
    var isopened = false;
    const todocontainer = document.querySelector(
      view.domstr.completedcontainer
    );
    todocontainer.addEventListener("click", (event) => {
      if (event.target.className === "edit" && isopened === false) {
        isopened = true;
        const changeId = event.target.id;
        console.log(event.target.className);
        const listItem = document.getElementById(event.target.id);
        const newItem = document.createElement("input");
        newItem.classList.add("newiteminput");
        listItem.parentNode.replaceChild(newItem, listItem);

        newItem.addEventListener("keyup", (event) => {
          if (event.key === "Enter" && event.target.value.trim() !== "") {
            isopened = false;
            console.log(event.target.value);
            const todo = new model.Edittruetodo(event.target.value);
            model.updateTodo(todo, changeId).then((todofromBE) => {
              state.todolist = [todofromBE, ...state.todolist];
            });
            event.target.value = "";
          }
        });
      }
    });
  };

  const editthetaskincomplete = () => {
    var isopened = false;
    const todocontainer = document.querySelector(view.domstr.todocontainer);
    todocontainer.addEventListener("click", (event) => {
      if (event.target.className === "edit" && isopened === false) {
        isopened = true;
        const changeId = event.target.id;
        const listItem = document.getElementById(event.target.id);
        const newItem = document.createElement("input");
        newItem.classList.add("newiteminput");
        listItem.parentNode.replaceChild(newItem, listItem);

        newItem.addEventListener("keyup", (event) => {
          if (event.key === "Enter" && event.target.value.trim() !== "") {
            isopened = false;
            console.log(event.target.value);
            const todo = new model.Todo(event.target.value);
            model.updateTodo(todo, changeId).then((todofromBE) => {
              state.todolist = [todofromBE, ...state.todolist];
            });
            event.target.value = "";
          }
        });
      }
    });
  };

  // create initial list of todos with the APIs
  const init = () => {
    model.getTodos().then((todos) => {
      state.todolist = todos.reverse().filter((todo) => {
        return todo.completed === false;
      });
      state.completedlist = todos.filter((todo) => {
        return todo.completed === true;
      });
    });
  };

  const bootstrap = () => {
    init();
    deleteTodo();
    deletecompleteTodo();
    addTodo();
    setCompleted();
    setUnCompleted();
    editthetaskcomplete();
    editthetaskincomplete();
  };

  return { bootstrap };
})(Model, View);

Controller.bootstrap();
