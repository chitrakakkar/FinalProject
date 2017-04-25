$(function()
{
    // Add a listener for input text; listen for Enter key.
    // Send POST request to create new task
    getAllTasks(); // calls /all url in index.js and displays all the data;line 92 on this page;

});
function addNewTaskForm()
{
    $("#new_task_button").click(function(event)
    {
        var Task_name = $("#new_task_text").val();
        addNewTask_AjaxCall(Task_name);
    });
}

function delete_Task()
{
    $(".delete").click(function()
    {
       var task_id=$(this).attr('id'); // this has the task_id
        delete_Task_Ajax(task_id);
    });
}

function Edit_task()
{
    $(".edit").click(function(){
        $(".taskName").attr('contentEditable',true);}).blur(function()
    {
        $(this).attr('contentEditable', false); });
        var new_text=$('.taskName').val();
        Edit_task_Ajax(new_text);

}

// Create elements for the html page
function addTasksToPage(tasks)
{
    var parent = $('#task_list');
    for (var i = 0 ; i < tasks.length ; i++)
    {
        add_task_to_webPage(tasks[i], parent);
    }
    delete_Task();
    Edit_task();


}
//dynamically creating html element for the task-list
function add_task_to_webPage(task, task_list)
{
    var html = '<div id="' + task._id + '" class="task-list"><span class="taskName">' + task.name + '</span><button id="' + task._id + '" class="edit">Edit</button><button id="' + task._id + '" class="delete">Delete</button>' +
        '<button id="' + task._id + '" class="Done">Done</button><button id="' + task._id + '" class="Done">Star</button></div> ';
    task_list.append(html);


}

// These functions make AJAX calls
// get all -/all router in index.js
function getAllTasks()
{

    $.ajax({
        method:"GET",
        url:"/all"
    }).done(function(data) {
        //Build HTML for each task in list
        addTasksToPage(data);
        addNewTaskForm();  //Once page is loaded, enable form

    }).fail(function(error){
        console.log("GET error");
        console.log(error);
    });
}
//adds new task-gets info from index.js-/add router
function addNewTask_AjaxCall(task)
{
    $.ajax({
        method:"POST",
        url:"/add",
        data: { "name" : task } //sends tasks to the /add route to add data to the database;
    }).done(function(data) // data has the  database with new data added;
    {
        console.log("I am the data " + task);

        console.log('POST complete');

        $('#new_task_text').val('');        // Clear input text box

        var task_list = $('#task_list'); // to display the task lists in the new div
        add_task_to_webPage(data, task_list); // add task on the web-page dynamically(line-41)
    }).fail(function(error){
        console.log('POST Error');
        console.log(error);
    });

}
function Edit_task_Ajax(task)
{
    console.log("I am the task", task);
    $.ajax({
        method: "POST",
        url: "/edit",
        data: { "name": task }  // sends id to /delete route in index.js
    }).done(function (data) // data has the result after deleting the task;
    {
        console.log('Update complete');
        // Select div containing this item, and remove from page
        $('.taskName').innerText = task;
    }).fail(function (error) {
        console.log('Update error');
        console.log(error);
    });

}

function delete_Task_Ajax(id)
{
    $.ajax({
        method: "POST",
        url: "/delete",
        data: { "id": id }  // sends id to /delete route in index.js
    }).done(function (data) // data has the result after deleting the task;
    {
        console.log('DELETE complete');
        // Select div containing this item, and remove from page
        var div_id = '#' + id + "";
        $(div_id).fadeOut(function()
        {
            $(this).remove();
        });
    }).fail(function (error) {
        console.log('DELETE error');
        console.log(error);
    });
}