const express = require("express")
const { BoardModel, TaskModel, subtaskModel } = require("../model/kanbanModel")

const KanbanRoutes = express.Router()

KanbanRoutes.get("/getboard", async (req, res) => {
  let userID = req.body.user
  console.log('userID:', userID)
  try {
    let data = await BoardModel.find({user:userID}).populate(["tasks", { path: "tasks", populate: { path: 'subtask' } }])
    res.status(200).send(data)
  } catch (err) {
    res.send({ "msg": "Something went wrong", "error": err })
  }
})

// ------------------------POST Routes---------------------------------------
KanbanRoutes.post("/addboard", async (req, res) => {
  console.log(req.body);
  try {
    let data = await new BoardModel(req.body)
    await data.save()
    res.status(200).send({ "msg": "Board Added successfull", "data": data })
  } catch (err) {
    res.status(404).send({ "msg": "Something went wrong", "error": err })
  }
})

KanbanRoutes.post("/addtask/:boardid", async (req, res) => {
  let boardid = req.params.boardid;
  let body = req.body;

  try {
    let subtask = body.subtask;
    let subarr = [];
    for (let i = 0; i < subtask.length; i++) {
      let newSub_task = await new subtaskModel(subtask[i]);
      await newSub_task.save();
      subarr.push(newSub_task._id);   // Need to push id only in the taskModel in array
    }

    body = { ...body, subtask: subarr };  //subtask form body removed with the arr having ID only
    let new_task = await new TaskModel(body); //updated ID array in the taskModel 
    await new_task.save();
    
    // Need to push the Task ID in the BoardModel in array 
    let data = await BoardModel.findById(boardid);
    let arr = [...data.tasks, new_task._id];  // extracting data and keeping task ID into the array
    let new_data = await BoardModel.findByIdAndUpdate(boardid, { tasks: arr })  // Task id updated in the BoardModel 

    res.status(200).send({ msg: "Task Added successfully", data: new_data });
  } catch (err) {
    res.status(500).send({ msg: "Something went wrong", error: err });
  }
});

KanbanRoutes.post("/addsubtask/:taskid", async (req, res) => {
  let taskid = req.params.taskid;
  let body = req.body;

  try {
    let newSub_task = await new subtaskModel(body);
    await newSub_task.save();
    let data = await TaskModel.findById(taskid);
    let arr = [...data.subtask]  // putting all previous subtask inside the array and then push new subtask id into that array
    arr.push(newSub_task._id)
    let new_task = await TaskModel.findByIdAndUpdate(taskid, {subtask:arr} );  //subtask id updated in the task
    res.status(200).send({ msg: "SubTask Added successfully"});
  } catch (err) {
    res.status(500).send({ msg: "Something went wrong", error: err });
  }
});
// ---------------------------------------------------------------------------

// ------------------------PATCH Routes---------------------------------------

KanbanRoutes.patch("/updateboard/:boardid", async (req, res) => {
  let boardid = req.params.boardid
  let body = req.body;

  try {
    let updated = await BoardModel.findByIdAndUpdate(boardid, body);
    res.status(200).send({ msg: "Board Updated successfully"});
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err });
  }
});

KanbanRoutes.patch("/updatetask/:taskid", async (req, res) => {
  let taskid = req.params.taskid
  let body = req.body;

  try {
    let updated = await TaskModel.findByIdAndUpdate(taskid, body);
    res.status(200).send({ msg: "Task Updated successfully"});
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err });
  }
});

KanbanRoutes.patch("/updatesubtask/:subtaskid", async (req, res) => {
  let subtaskid = req.params.subtaskid
  let body = req.body;

  try {
    let updated = await subtaskModel.findByIdAndUpdate(subtaskid, body);
    res.status(200).send({ msg: "Sub-Task Updated successfully" });
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err });
  }
});

// ---------------------------------------------------------------------------

// ------------------------DELETE Routes---------------------------------------

KanbanRoutes.delete("/deleteboard/:boardid", async (req, res) => {
  let boardid = req.params.boardid

  try {
    let board = await BoardModel.findById(boardid); //find the boardID and check weather it have any task or not 
    let tasks = board.tasks
    // console.log(tasks.length);
    if(tasks.length!=0){    //If task available in the board then 
      for(let i=0;i<tasks.length;i++){
        let removedFromBoard = await BoardModel.findByIdAndUpdate(boardid,{tasks:[]});   // Empty the task of the Board Id
        if(tasks[i].subtask.length!=0){  //If subtask available in the task associated in the Board to be deleted
          for(let j=0;j<tasks[i].subtask.length;j++){
            let removedFromTasks = await TaskModel.findByIdAndUpdate(taskid,{subtask:[]});   //Empty the subtask of the task associated in the Board to be deleted
            let deletedSubTask = await subtaskModel.findByIdAndDelete(tasks[i].subtask[j]); // finally delete the subtasks
          }
        }
        let deletedTask = await TaskModel.findByIdAndDelete(tasks[i]);
      }
    }
    let deleted = await BoardModel.findByIdAndDelete(boardid);
    res.status(200).send({ msg: "Board deleted successfully" });
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err });
  }
});


KanbanRoutes.delete("/deletetask/:boardid/:taskid", async (req, res) => {
  let taskid = req.params.taskid
  let boardid = req.params.boardid
  
  try {
    let maintask = await TaskModel.findById(taskid);
    let subtask = maintask.subtask // catch the subtask of the Task that need to be deleted
    if(subtask.length!=0){
      for(let j=0;j<subtask.length;j++){     //iterate through all the task and delete the subtask associated with the deleted task one by one
        let removedFromTasks = await TaskModel.findByIdAndUpdate(taskid,{subtask:[]});   //Empty subtask available in the task
        let deletedSubTask = await subtaskModel.findByIdAndDelete(subtask[j]);  // Delete the subtask
      }
    }

    let board = await BoardModel.findById(boardid); // now look for the ID in which that task Id is present
    // console.log(board); 
    let newTasksArr = board.tasks.filter((el)=>{  // return the elements who is not having the task ID
      return el!=taskid
    })
    // console.log(newTasksArr);
    let removedFromBoard = await BoardModel.findByIdAndUpdate(boardid,{tasks:newTasksArr});   // remove the Task from the Board
    let deleted = await TaskModel.findByIdAndDelete(taskid); //Delete the task
    res.status(200).send({ msg: "Task Deleted successfully"});
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err });
  }
});


KanbanRoutes.delete("/deletesubtask/:taskid/:subtaskid", async (req, res) => {
  let taskid = req.params.taskid
  let subtaskid = req.params.subtaskid

  try {
    let board = await TaskModel.findById(taskid);
    let newSubTaskArr = board.subtask.filter((el)=>{ // return the elements who is not having the subtask ID
      return el!=subtaskid
    })
    // console.log(newSubTaskArr);
    let removedFromTasks = await TaskModel.findByIdAndUpdate(taskid,{subtask:newSubTaskArr}); //now update the task after removing the subtask id to be deleted
    let deleted = await subtaskModel.findByIdAndDelete(subtaskid);
    res.status(200).send({ msg: "Sub-Task Deleted successfully" });
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err });
  }
});

module.exports = { KanbanRoutes }
