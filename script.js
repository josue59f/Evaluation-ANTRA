// Could not implement edit in time - I could if I had a bit more time :(
// edit logic would add input box(or hide span with list item) -> then update state
// and DB via the patch API -> rerender new item that has been edited

// also had a hard time implementing SVG icons and did not have time to finish CSS
// also could not tie in submit button as well so press enter to add list item
// whatever the result I appreciate the opportunity! going back and relearning basic JS
// proved to be more difficult than using React
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
    })
      .then((response) => response.json())
      .then((json) => console.log(json));

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
    fetch("https://jsonplaceholder.typicode.com/posts/1", {
      method: "PATCH",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((response) => response.json());

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
          <span>${todo.id}-${todo.title}</span>
          <button class="edit" id="${todo.id}"> edit </button>
           <button class="deletebtn" id="${todo.id}">X</button>
          <button class="arrow" id="${todo.id}">-></button>
      `;
    });
    return tmp;
  };

  const tmpcompleted = (arr) => {
    let tmp = "";
    arr.forEach((todo) => {
      tmp += `
        <li class = "eachli">
        <button class="arrow" id="${todo.id}"> <- </button>
          <span>${todo.id}-${todo.title}</span>
           <button class="edit" id="${todo.id}"> edit </button>
           <button class="deletebtn" id="${todo.id}">X</button>
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
  // create the state to store the todos and have functions to access and manipulate
  class State {
    #todolist = [];
    #completedlist = [];
    // #completed = [];

    // get completed() {
    //   return this.#completed;
    // }

    get todolist() {
      return this.#todolist;
    }

    get completedlist() {
      return this.#completedlist;
    }
    // set completed(newtodolist) {
    //   this.#todolist = newtodolist;
    //   const completedcontainer = document.querySelector(
    //     view.domstr.completedcontainer
    //   );
    //   const tmp = view.createTmp(this.#todolist);
    //   view.render(completedcontainer, tmp);
    // }

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
    const todocontainer = document.querySelector(
      view.domstr.completedcontainer
    );
    todocontainer.addEventListener("click", (event) => {
      if (event.target.className === "edit") {
        console.log("edit pressed");
        document.createElement("input");
      }
    });
  };

  const editthetaskincomplete = () => {
    const todocontainer = document.querySelector(view.domstr.todocontainer);
    todocontainer.addEventListener("click", (event) => {
      if (event.target.className === "edit") {
        console.log("edit pressed");
        todocontainer.span = "input";
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
      // console.log(todos);
      // console.log(todos[0].completed);
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
