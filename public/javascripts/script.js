$(function()
{
    // Add a listener for input text; listen for Enter key.
    // Send POST request to create new place
    getAllTasks(); // calls /all url in index.js and displays all the data;line 92 on this page;

});
//when you hit enter which #13, it calls addnewTasks(line 112) with input text value
function addNewTaskForm()
{
    $("#new_task_button").click(function(event)
    {
        var Task_name = $("#new_task_text").val();
        console.log("I am the tak name "+ Task_name);
        // if (event.which == 13 && Task_name )
        // {   //if user presses Enter and $(this).val has a value
            addNewTask(Task_name);
        //}
    });
}

// Create elements for the html page
function addPlacesToPage(tasks)
{
    var parent = $('#task_list');
    for (var i = 0 ; i < tasks.length ; i++)
    {
        addNewTask(tasks[i], parent);
    }

}

//dynamically creating html element for the travel-list
function add_task(task, parent)
{
    console.log("I am final place "+JSON.stringify(task));
    console.log("Id" + task._id);
    //console.log("Name"+ obj.name);

    var html = '<div id="' + task._id + '"><span class="taskName">' + task.name + '</span><button class="edit">Edit</button><button class="delete">Delete</button><button class="Done">Done</button> ';
    parent.append(html);
}


// These functions make AJAX calls
// get all -/all router in index.js
function getAllTasks(){

    $.ajax({
        method:"GET",
        url:"/all"
    }).done(function(data) {
        //Build HTML for each place in list
        addPlacesToPage(data);
        //console.log(data[data.length-1].name);
        addNewTaskForm();  //Once page is loaded, enable form

    }).fail(function(error){
        console.log("GET error");
        console.log(error);
    });
}
//adds new places-gets info from index.js-/add router
function addNewTask(task){
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

        // // Update listeners
        // var new_checkbox_id = '#' +data._id + '_is_visited';
        // var new_delete_id = '#' +data._id + '_delete';

        //$(new_checkbox_id).click(checkListener);
        //$(new_delete_id).click(deleteListener);
    }).fail(function(error){
        console.log('POST Error');
        console.log(error);
    });

}