import React, { useState, useEffect } from 'react'
import './TodoApp.css';

function TodoApp() {
    const [todos, setTodos] = useState([]);  //creating a todolist and we are gonna save our todo in an array of objects with each todo being an individual object  
    const [todo, setTodo] = useState("");    //to keep track of current todo that we are adding    

    const [todoEditing, setTodoEditing] = useState(null);   //todoEditing -> holds the value of the 'id' of the toto er'are editing, and initially we are not editing anything so it's 'nulll'
    const [editingText, setEditingText] = useState("");


    // used this to store our data locally.local storage so that we can access it after refresh also


    // getting storage
    useEffect(() => {
        const getValueTemp = localStorage.getItem("getTodosList");   //argument is the name we defined earlier .. see above
        const loadedTodos = JSON.parse(getValueTemp);   //converted back to javascript from json data

        // check to make sure that we have some todos in local storage to display, like it was first time for the user to visit the app then there will be no data in locale storage
        if (loadedTodos) {
            setTodos(loadedTodos);
        }
    }, [])

    // ques: A tiny issue on 35:30, when I put the load hook under the store hook,  refresh page will remove local storage and the page is empty. Video mentioned you can put it under. Any advice?
    // ans :  If the loading hook goes below the saving hook, the list will initially save an empty array as the todos. Should work fine with the loading look above the saving one!

    // setting storage
    useEffect(() => {
        const changeToJsonTemp = JSON.stringify(todos);  //will convert any javascript into json
        console.log(changeToJsonTemp);
        localStorage.setItem("getTodosList", changeToJsonTemp);  //setting it to local storage and can be accessed through the vaialble wee defined namely 'getTodosList'
    }, [todos])   //whatever we pass here, useEffect will run every time that changes(here 'todos' state)    ...  if left empty (like this []), then it will only run once when the component is mounted / or at the very start / at the page load


    const handleSubmit = (e) => {
        e.preventDefault();  //prevents refreshing of page  ..  common practice in react form world

        const newTodo = {   //creating an object for our todos array and then applying some properties(like id(should be unique), text, isCompleted) .. must have most of the time
            id: new Date().getTime(),
            text: todo,
            isCompleted: false
        }

        if (todo !== "") { // to rectify empty inputs

            //it's a good practice to use spread operator(...x) if we had an already availaible array and want to clone data in it, asa it ensures that it doesn't mutates the original data    ... see google
            setTodos([...todos].concat(newTodo));  //will add/concat our newly created todo with the already availaible todos in the 'todos' array

            setTodo("");   // to empty the input field after every time we successfully added the new todo to the todos array
        }
    }

    const deleteTodo = (id) => {
        const updatedTodos = [...todos].filter(
            // (todo) => todo.id !== id
            (todo) => {
                if (todo.id !== id) {
                    return todo;
                }
            }
        )   //filter - it is simliar to map function and takes a bollean value  ..  it includes only all those those values which are truthy and  filters out falsy values
        setTodos(updatedTodos);
    }

    const toggleComplete = (id) => {
        const updatedTodos2 = [...todos].map((todo) => {
            if (todo.id === id) {     //specifies that we are working on the current todo
                todo.isCompleted = !todo.isCompleted;    //toggles between true and false
            }
            return todo;
        })

        setTodos(updatedTodos2);
    }


    const editTodo = (id) => {
        const updatedTodos3 = [...todos].map((todo) => {
            if (todo.id === id) {
                if (editingText !== "") {  //to rectify empty inputs
                    todo.text = editingText;
                }
            }
            return todo;
        })

        setTodos(updatedTodos3);

        // reseting our editingText and todoEditing
        setTodoEditing(null);
        setEditingText("");
    }



    // const newText = (id,textValue) => {
    //     const updatedtodos4 = [...todos].map((todo) => {
    //         if(todo.id === id){
    //             const editValue = textValue + todo.editingText;
    //             return editValue;        
    //         }
    //     })
    // }

    return (
        <>
            <div className="todo-wrapper">
                <div className="todo-container">

                    <div className="todo-heading">
                        <h1>What's the Plan for Today?</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="todo-form">
                        <input
                            type="text"
                            onChange={(e) => setTodo(e.target.value)}
                            value={todo}
                            autoFocus
                            className="todo-inp"
                        />
                        <button type="submit" className="todo-btn">Add Todo</button>
                    </form>

                    <div className="todo-items">
                        {todos.map((td) => (
                            <div key={td.id} className="todo-item">
                                {/* on clicking edit btn we want to change our below div(only for that particular todo) to an input field to get new updated text/data as an edit*/}
                                {todoEditing === td.id ?
                                    (
                                        <>
                                            <input
                                                type="text"
                                                // placeholder={td.text}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                // value={() => newText(td.id,td.text)}
                                                value={editingText}
                                                autoFocus
                                                className="todo-txt"
                                            />

                                             {/* submit btn after editing */}
                                            <button
                                                className="btn editSubmitBtn"
                                                onClick={() => editTodo(td.id)}>
                                                <i className="fas fa-check"></i>
                                            </button>
                                        </>

                                    )
                                    :
                                    (
                                        <div className="todo-txt-delBtn">
                                            <div className={td.isCompleted ? "todo-txt completed" : "todo-txt incomplete"}>
                                                {td.text}
                                            </div>

                                            {/* delete functionality */}
                                            <button
                                                className="btn delBtn"
                                                onClick={() => deleteTodo(td.id)}>
                                                <i className="fas fa-minus-circle"></i>
                                            </button>
                                        </div>
                                    )
                                }

                                <div className="btn-grp">
                                    {/* edit functionality */}
                                    {/* to display only one of the below two btns */}
                                    {todoEditing === td.id ?
                                        (
                                            console.log("asas")
                                        )
                                        :
                                        (<button
                                            className="btn editBtn"
                                            onClick={() => setTodoEditing(td.id)}>
                                            <i className="fas fa-edit"></i>
                                        </button>)

                                    }
                                </div>



                                {/* checked/completed functionality */}
                                {/* <input
                                            type="checkbox"
                                            onChange={() => toggleComplete(td.id)}
                                            checked={td.isCompleted}  //takes true or false and if true => checked , false => not checked    
                                    /> */}

                            </div>)
                        )}
                    </div>

                </div>
            </div>
        </>
    )
}

export default TodoApp;
