// this file takes care of the client side JS functionality;
$(function()
{

    // $("head").append('<script type="text/javascript" src="/javascripts/jquery.jeditable.js"></script>');

    // Send POST request to create new task
    addNewTaskForm();
    getAllTasks(); // calls /all url in index.js and displays all the data;line 92 on this page;
    mark_all_done();// triggers mark_all_done task function;
});
function addNewTaskForm()
{
    $("#new_task_button").click(function(event)
    {
        var Task_name = $("#new_task_text").val();
        addNewTask_AjaxCall(Task_name);
    });
    // check if enter is pressed to add new task; triggers #new_task_button function;
    $('#new_task_text').keypress(function (e) {

        if(e.which == 13)  // the enter key code
        {
            $('#new_task_button').click();
        }
    });
}

function mark_all_done()
{
    $('#mark_all_done__button').click(function (event)
    {
        mark_all_done_task_Ajax();
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
    var new_task_counter= $(".task-list").length; // gives number of items in the div created below;
    //dynamically creating html elements;New tasks;
    var task =  $('<div id="' + task._id + '" class="task-list"><button id="' + task._id + '" class="Done">Done</button><span id="counter">' + new_task_counter+ "."+ '</span><span id="' + task._id + '" class="taskName">' + task.name+ '</span><button id="' + task._id + '" class="delete">Delete</button></div><br>');

    // triggers button click, editable and done task functionality;
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
// similar to new task;this is completed task list;
function addCompletedTasksToPage(CompletedTasks)
{
    var Completed_task_list=$('#Completed_task_list');
    for(var i=0;i<CompletedTasks.length;i++)
    {
        Add_CompletedTask_to_Webpage(CompletedTasks[i], Completed_task_list)
    }

}
// adds the completed task on to completed task div;
function  Add_CompletedTask_to_Webpage(Completed_task, Completed_task_list)
{
    var done_task_Counter=$(".Completed_task-list").length;
    var Completed_task =  $('<div id="' + Completed_task._id + '" class="Completed_task-list"><button id="' + Completed_task._id + '" class="Add">Add</button><span id="' + Completed_task._id + '" class="CompletedtaskName">' + done_task_Counter+ ". " + Completed_task.name+ '</span><button id="' + Completed_task._id + '" class="delete">Delete</button></div><br>');
    done_task_Counter++;
    Completed_task_list.append(Completed_task);

    // delete and add back to the list functinality for completed task div;
    $("button.delete" , Completed_task).click(function ()
    {
        delete_Task_Ajax($(this).attr('id'));

    });
    $("button.Add" , Completed_task).click(function ()
    {
        AddCompletedTaskAsNewTask_AjaxCall($(this).attr('id'))

    });

}
// These functions make AJAX calls
// get all -/all router in index.js
function getAllTasks()
{

    $.ajax({
        method:"GET",
        url:"/all"
    }).done(function(data)
    {
        //Build HTML for each task in list
        addTasksToPage(data.tasks);
        //addNewTaskForm();  //Once page is loaded, enable form
        addCompletedTasksToPage(data.doneTasks);

    }).fail(function(error){
        console.log("GET error");
        console.log(error);
    });
}
//adds new task-gets info from index.js-/add router
function addNewTask_AjaxCall(task)
{
    //add button validation
    if(task.length >0)
    {
    $.ajax({
        method:"POST",
        url:"/add",
        data: { "name" : task } //sends tasks to the /add route to add data to the database;
    }).done(function(data) // data has the  database with new data added;
    {

        // check for duplicate item for the to do task;
        if(data === "Duplicate Entry")
        {
            alert("Task already exists !!");
            $('#new_task_text').val('');
            $('#new_task_button').css({'outline': 'none'});

        }
        else {
            console.log("I am the data " + JSON.stringify(data));

            console.log('POST complete');

            $('#new_task_text').val('');        // Clear input text box


            var task_list = $('#task_list'); // to display the task lists in the new div
            add_task_to_webPage(data, task_list); // add task on the web-page dynamically(line-41)
        }
    }).fail(function(error){
        console.log('POST Error');
        console.log(error);
    });}
    else {

        alert("Empty string not allowed !");
        $('#new_task_button').css({'outline': 'none'}); // removes button highlight
    }

}
// delete ajax;calls /delete in index.js and gets the updated data(in data field) from the database;
function delete_Task_Ajax(id)
{
    // delete confirmation message on client side;
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
// done ajax;calls /done in index.js and gets the updated data(in data field) from the database;
function done_task_Ajax(id)
{
    var task_list = $('#task_list');
    $.ajax({
        method: "POST",
        url: "/done",
        data: { "id": id }  // sends id to /delete route in index.js
    }).done(function (data) // data has the result after moving the task;
    {
        alert(data.name + " Has been moved to done task list !!");
        var Completed_task_list=$('#Completed_task_list');
        Add_CompletedTask_to_Webpage(data, Completed_task_list);
        var div_id = '#' + id + "";
        // removes the new task from new task page;
        $(div_id).fadeOut(function () {
            $(this).remove();
        });
    }).fail(function (error) {
        console.log('done error');
        console.log(error);
    });
}
// mark all done ajax;calls /markedalldone in index.js and gets the updated data(in data field) from the database;
function mark_all_done_task_Ajax()
{

    if ($(".task-list").length != 0)
    {
        $.ajax({
            method: "POST",
            url: "/markedalldone"// sends id to /delete route in index.js
        }).done(function (data) // data has the result after moving the task;
        {
            // document.open(data);
            // document.write(data);
            // document.close(data);

            // task_list.remove();
            // task_list.splice(0,task_list.length);
            //empty both the list so that it updates new items on the page;
            $('#task_list').empty();
            $('#Completed_task_list').empty();
            getAllTasks();
            $('#mark_all_done__button').css({'outline': 'none'});
            alert("All tasks Have been moved to done task list !!")
            }).fail(function (error) {
                console.log('done error');
                console.log(error);
            });
    }
    else
        {
            alert("Nothing to move !!! ");
            $('#mark_all_done__button').css({'outline': 'none'});
        }

}
// add done task as new ajax;calls /CompletedAsNew in index.js and gets the updated data(in data field) from the database;
function AddCompletedTaskAsNewTask_AjaxCall(id)
{
    $.ajax({
        method: "POST",
        url: "/CompletedAsNew",// sends id to /delete route in index.js
        data: { "id": id }
    }).done(function (data) // data has the result after moving the data;
    {
        console.log("Check data !", data);
        var div_id = '#' + id + "";
        $(div_id).fadeOut(function () {
            $(this).remove();
        });
        var task_list = $('#task_list'); // to display the task lists in the new div
        add_task_to_webPage(data, task_list);
        // add_task_to_webPage();
        //addNewTaskForm();  //Once page is loaded, enable form
        alert( data.name + " task has been moved to the new task list !!")
    }).fail(function (error) {
        console.log('done error');
        console.log(error);
    });
}