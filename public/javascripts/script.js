$(function()
{

    // $("head").append('<script type="text/javascript" src="/javascripts/jquery.jeditable.js"></script>');
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



// function Edit_task()
// {
//$(this).text("Save");
//$(".taskName").attr('contentEditable',true);
//     $(".edit").click(function(){
//         $(".taskName").attr('contentEditable',true);}).blur(function()
//     {
//         $(this).attr('contentEditable', false); });
//         var new_text=$('.taskName').val();
//         Edit_task_Ajax(new_text);
//
// }

// Create elements for the html page
function addTasksToPage(tasks)
{
    var task_list = $('#task_list');
    for (var i = 0 ; i < tasks.length ; i++)
    {
        add_task_to_webPage(tasks[i], task_list);
    }

}
//dynamically creating html element for the task-list
function add_task_to_webPage(task, task_list)
{

    var task =  $('<div id="' + task._id + '" class="task-list"><button id="' + task._id + '" class="Done">Done</button><span id="' + task._id + '" class="taskName">' + task.name +'(click to edit)'+ '</span><button id="' + task._id + '" class="delete">Delete</button></div><br>');
    $("button.delete" , task).click(function ()
    {
        delete_Task_Ajax($(this).attr('id'));

    });

    $("span.taskName", task).editable('/edit',
    {
        name:'name'

    });
    $("button.Done" , task).click(function ()
    {
        done_task_Ajax($(this).attr('id'));

    });


   task_list.append(task);


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
        console.log("I am the data " + JSON.stringify(data));

        console.log('POST complete');

        $('#new_task_text').val('');        // Clear input text box

        var task_list = $('#task_list'); // to display the task lists in the new div
        add_task_to_webPage(data, task_list); // add task on the web-page dynamically(line-41)
    }).fail(function(error){
        console.log('POST Error');
        console.log(error);
    });

}
// function Edit_task_Ajax(task)
// {
//     console.log("I am the task", task);
//     $.ajax({
//         method: "POST",
//         url: "/edit",
//         data: { "name": task }  // sends id to /delete route in index.js
//     }).done(function (data) // data has the result after deleting the task;
//     {
//         console.log('Update complete');
//         // Select div containing this item, and remove from page
//         $('.taskName').innerText = task;
//     }).fail(function (error) {
//         console.log('Update error');
//         console.log(error);
//     });
//
// }

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
        alert("Are you sure you want to delete " + data.name+ "?");
        alert(data.name+" has been deleted")
    }).fail(function (error)
    {
        console.log('DELETE error');
        console.log(error);
    });
}

function done_task_Ajax(id)
{
    $.ajax({
        method: "POST",
        url: "/done",
        data: { "id": id }  // sends id to /delete route in index.js
    }).done(function (data) // data has the result after deleting the task;
    {
        document.open();
        document.write(data);
        document.close();
        alert(JSON.stringify(data) + "Has been moved to done task list !!")
    }).fail(function (error) {
        console.log('done error');
        console.log(error);
    });
}