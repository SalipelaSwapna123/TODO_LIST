import React, {useState, useEffect} from 'react';
import './App.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';// to import icons
import {BsCheckLg} from 'react-icons/bs';
import {FaGithub, FaEnvelope } from 'react-icons/fa';


function App () {

// State Management
  const [allTodos, setAllTodos] = useState ([]);
  const [newTodoTitle, setNewTodoTitle] = useState ('');
  const [newDescription, setNewDescription] = useState ('');
  const [completedTodos, setCompletedTodos] = useState ([]);
  const [isCompletedScreen, setIsCompletedScreen] = useState (false);
  const [editingIndex, setEditingIndex] = useState(null); // Track the index of the item being edited
  const [updatedTitle, setUpdatedTitle] = useState(''); // Store the updated title
  const [updatedDescription, setUpdatedDescription] = useState(''); // Store the updated description



  const handleEdit = (index) => {
    const todoToEdit = allTodos[index];
    setEditingIndex(index);
    setUpdatedTitle(todoToEdit.title);
    setUpdatedDescription(todoToEdit.description);
  };
  const handleUpdate = () => {
    const updatedTodo = { title: updatedTitle, description: updatedDescription };
    const updatedTodos = [...allTodos];
    updatedTodos[editingIndex] = updatedTodo;
    setAllTodos(updatedTodos);
    localStorage.setItem('todolist', JSON.stringify(updatedTodos));
    setEditingIndex(null);
    setUpdatedTitle('');
    setUpdatedDescription('');
  };


  // Function to add a new to-do
  const handleAddNewToDo = () => {
    let newToDoObj = {
      title: newTodoTitle,
      description: newDescription,
    };
    
    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push (newToDoObj);
    
    setAllTodos (updatedTodoArr);
    localStorage.setItem ('todolist', JSON.stringify (updatedTodoArr));
    setNewDescription ('');
    setNewTodoTitle ('');
  };


  
  // useEffect to initialize state from local storage on component mount
  useEffect (() => {
    let savedTodos = JSON.parse (localStorage.getItem ('todolist'));
    let savedCompletedToDos = JSON.parse (
      localStorage.getItem ('completedTodos')
    );
    if (savedTodos) {
      setAllTodos (savedTodos);
    }

    if (savedCompletedToDos) {
      setCompletedTodos (savedCompletedToDos);
    }
  }, []);


   // Function to delete a to-do
  const handleToDoDelete = index => {
    let reducedTodos = [...allTodos];
    reducedTodos.splice (index);
    
    localStorage.setItem ('todolist', JSON.stringify (reducedTodos));
    setAllTodos (reducedTodos);
  };

   // Function to delete a completed to-do
  const handleCompletedTodoDelete = index => {
    let reducedCompletedTodos = [...completedTodos];
    reducedCompletedTodos.splice (index);
    
    localStorage.setItem (
      'completedTodos',
      JSON.stringify (reducedCompletedTodos)
    );
    setCompletedTodos (reducedCompletedTodos);
  };


  
  // Function to mark a to-do as completed
  const handleComplete = index => {
    const date = new Date ();
    var dd = date.getDate ();
    var mm = date.getMonth () + 1;
    var yyyy = date.getFullYear ();
    var hh = date.getHours ();
    var minutes = date.getMinutes ();
    var ss = date.getSeconds ();
    var finalDate =
      dd + '-' + mm + '-' + yyyy + ' at ' + hh + ':' + minutes + ':' + ss;

    let filteredTodo = {
      ...allTodos[index],
      completedOn: finalDate,
    };

    

    let updatedCompletedList = [...completedTodos, filteredTodo];
    console.log (updatedCompletedList);
    setCompletedTodos (updatedCompletedList);
    localStorage.setItem (
      'completedTodos',
      JSON.stringify (updatedCompletedList)
    );
   

    handleToDoDelete (index);
  };


  // JSX rendering
  return (
    <div className="App">
      <h1>My Todos...</h1>

      <div className="todo-wrapper">

        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title:</label>
            <input
              type="text"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle (e.target.value)}
              placeholder="What's the title of your To Do?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description:</label>
            <input
              type="text"
              value={newDescription}
              onChange={e => setNewDescription (e.target.value)}
              placeholder="What's the description of your To Do?"
            />
          </div>
          <div className="todo-input-item">
            <button
              className="primary-btn"
              type="button"
              onClick={handleAddNewToDo}
            >
              Add
            </button>
          </div>
        </div>
        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompletedScreen === false && 'active'}`}
            onClick={() => setIsCompletedScreen (false)}
          >
            To Do
          </button>
          <button
            className={`secondaryBtn ${isCompletedScreen === true && 'active'}`}
            onClick={() => setIsCompletedScreen (true)}
          >
            Completed
          </button>
          
            </div>
        <div className="todo-list">

          {isCompletedScreen === false &&
            allTodos.map ((item, index) => (
              <div className="todo-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                </div>
                <div>
                  <AiOutlineDelete
                    title="Delete?"
                    className="icon"
                    onClick={() => handleToDoDelete (index)}
                  />
                   <AiOutlineEdit
                    title="Edit?"
                    className="icon"
                    onClick={() => handleEdit(index)} // Call the edit function
                  />
                  <BsCheckLg
                    title="Completed?"
                    className=" check-icon"
                    onClick={() => handleComplete (index)}
                  />
                </div>
              </div>
            ))}
               {editingIndex !== null && (
            <div className="todo-list-item">
              <div>
                <input
                  type="text"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  placeholder="Updated title"
                />
                <input
                  type="text"
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                  placeholder="Updated description"
                />
              </div>
              <div>
                <button className="primary-btn" onClick={handleUpdate}>
                  Update
                </button>
              </div>
            </div>
          )}

          {isCompletedScreen === true &&
            completedTodos.map ((item, index) => (
              <div className="todo-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p> <i>Completed at: {item.completedOn}</i></p>
                </div>
                <div>
                  <AiOutlineDelete  className="icon" onClick={() => handleCompletedTodoDelete (index)}  />
                </div>
              </div>
            ))}
            
            <div className="icon-row">
            <div className="icon">
            <a href='https://github.com/SalipelaSwapna123'>
            <FaGithub />
            </a>
          </div>
          <div className="icon">
          <a href="mailto:salipelaswapna@gmail.com">
            <FaEnvelope />
            </a>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
