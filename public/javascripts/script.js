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
function deleteTask()
{
    $(".delete").click(function(event)
    {
        var task_id = $(this).attr('id');
        deletePlace(task_id);

    });
}

// Create elements for the html page
function addTasksToPage(tasks)
{
    var parent = $('#task_list');
    for (var i = 0 ; i < tasks.length ; i++)
    {
        add_task_to_webPage(tasks[i], parent);
    }

}
//dynamically creating html element for the travel-list
function add_task_to_webPage(task, parent)
{
    console.log("I am  the final task "+JSON.stringify(task));
    console.log("Id" + task._id);
    var html = '<div id="' + task._id + '"><span class="taskName">' + task.name + '</span><button class="edit">Edit</button><button id=" + task._id + " class="delete">Delete</button>' +
        '<button class="Done">Done</button><button class="Done">Starred</button> ';
    parent.append(html);
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
function addNewTask_AjaxCall(task){
    $.ajax({
        method:"POST",
        url:"/add",
        data: { "name" : task }
    }).done(function(data)
    {
        console.log("I am the data" + task);

        console.log('POST complete');

        $('#new_task_text').val('');        // Clear input text box

        var parent = $('#task_list');
        add_task(data, parent);
    }).fail(function(error){
        console.log('POST Error');
        console.log(error);
    });

}

// gets id from /delete route in index.js
function deletePlace(id)
{
    $.ajax({
        method: "DELETE",
        url: "/delete",
        data: { "id": id }
    }).done(function (data)
    {
        console.log('DELETE complete');
        // Select div containing this item, and remove from page
        var selector_id = '#' + data.id + "";
        $(selector_id).fadeOut(function()
        {
            $(this).remove();
        });
        deleteTask(); // delete the task from the web-page
    }).fail(function (error) {
        console.log('DELETE error');
        console.log(error);
    });
}