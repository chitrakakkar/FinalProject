var counter=0;
$(function()
{

    // $("head").append('<script type="text/javascript" src="/javascripts/jquery.jeditable.js"></script>');
    // Add a listener for input text; listen for Enter key.
    // Send POST request to create new task
    getAllTasks(); // calls /all url in index.js and displays all the data;line 92 on this page;
    mark_all_done()
});
function addNewTaskForm()
{
    $("#new_task_button").click(function(event)
    {
        var Task_name = $("#new_task_text").val();
        addNewTask_AjaxCall(Task_name);
    });
}

function mark_all_done()
{
    $('#mark_all_done__button').click(function (event)
    {
        mark_all_done_task_Ajax()
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
    counter++;
    var task =  $('<div id="' + task._id + '" class="task-list"><button id="' + task._id + '" class="Done">Done</button><span id="' + task._id + '" class="taskName">' + counter + ". " + task.name+ '</span><button id="' + task._id + '" class="delete">Delete</button></div><br>');

    $("button.delete" , task).click(function ()
    {
        delete_Task_Ajax($(this).attr('id'));

    });

    $("span.taskName", task).editable('/edit',
    {
        name:'name',
        onblur:'ignore'

    });
    $("button.Done" , task).click(function ()
    {
        done_task_Ajax($(this).attr('id'));

    });

    task_list.append(task);

}
function addCompletedTasksToPage(CompletedTasks)
{
    var Completed_task_list=$('#completed_task_list');
    for(var i=0;i<CompletedTasks.length;i++)
    {
        Add_CompletedTask_to_Webpage(CompletedTasks[i], Completed_task_list)
    }

}
function  Add_CompletedTask_to_Webpage(Completed_task, Completed_task_list)
{
    var Completed_task =  $('<div id="' + Completed_task._id + '" class="Completed_task-list"><button id="' + Completed_task._id + '" class="Done">Done</button><span id="' + Completed_task._id + '" class="taskName">' + counter + ". " + Completed_task.name+ '</span><button id="' + Completed_task._id + '" class="delete">Delete</button></div><br>');
    Completed_task_list.append(Completed_task);
}
// These functions make AJAX calls
// get all -/all router in index.js
function getAllTasks()
{

    $.ajax({
        method:"GET",
        url:"/all"
    }).done(function(newTask, CompletedTask)
    {
        alert(JSON.stringify(newTask));
        alert(JSON.stringify(CompletedTask));
        //Build HTML for each task in list
        addTasksToPage(newTask);
        addNewTaskForm();  //Once page is loaded, enable form
        addCompletedTasksToPage(CompletedTask);

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

function delete_Task_Ajax(id)
{
    if(confirm('Are you sure you want to delete?'))
    {
    $.ajax({
        method: "POST",
        url: "/delete",
        data: { "id": id }  // sends id to /delete route in index.js
    }).done(function (data) // data has the result after deleting the task;
    {

        // Select div containing this item, and remove from page
        var div_id = '#' + id + "";
        $(div_id).fadeOut(function () {
            $(this).remove();
        });
        console.log('DELETE complete');
        alert(data.name + " has been deleted")
    }).fail(function (error)
    {
        console.log('DELETE error');
        console.log(error);
    });
    }
    else
        {
        alert("delete cancelled !!! ")
    }
}

function done_task_Ajax(id)
{
    $.ajax({
        method: "POST",
        url: "/done",
        data: { "id": id }  // sends id to /delete route in index.js
    }).done(function (data) // data has the result after deleting the task;
    {
        document.open();  // render html page;opens the page;writes on it and closes it(for my understanding)
        document.write(data); // taken from stack over flow;
        document.close();
        alert(JSON.stringify(data) + "Has been moved to done task list !!")
    }).fail(function (error) {
        console.log('done error');
        console.log(error);
    });
}

function mark_all_done_task_Ajax()
{
    $.ajax({
        method: "POST",
        url: "/markedalldone"// sends id to /delete route in index.js
    }).done(function (data) // data has the result after deleting the task;
    {
        task_list.remove();

        alert( "All tasks Have been moved to done task list !!")
    }).fail(function (error) {
        console.log('done error');
        console.log(error);
    });
}