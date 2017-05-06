var express = require('express');
var router = express.Router();
var Task = require('../models/task'); // grabs schema from the task.js;no more db.collection


/* GET home page. */
router.get('/', function(req, res, next) {
    //.find() gets all the documents inside a collection
    Task.find({done: false}, function (err, newtasks)
    {
        if (err) {
            return next(err)}

                else {
                    res.render('index', {title: 'To Do List', tasks: newtasks}); // tasksDocs contains all object items
                }
                console.log("I am the new tasks",newtasks);

            })
    });


/* GET all items home page. */
router.get('/all', function(req, res) {
    Task.find({done: false}, function (err, taskDocs) {
        if (err) {
            return next(err)
        }
        else {
            Task.find({done: true}, function (err, doneTasks) {
                if (err) {
                    return next(err)
                }
                console.log(taskDocs);
                console.log(doneTasks);
                res.json({tasks: taskDocs, doneTasks: doneTasks}); // returns Json object
            })
        }
    });
});

router.post('/add', function(req, res, next)
{
    if (!req.body || !req.body.name)
    {
        //req.flash('error', 'Please enter some text');
        res.redirect('/');
    }
    else
    {
     var task= Task({ name : req.body.name, done: false});
      task.save(function(err)
        {
            if (err) {
                return next(err);
            }
           res.json(task)
        });
    }
});
//delete a task;
router.post('/delete', function (req, res, next)
{
    // Task.find(req.body.id, function (err, result)
    // {
    //     console.log("I am the name", result);
    //
    // });
    // req.body has id ;not _id;
    Task.findByIdAndRemove(req.body.id,function (err, result)
    {
        console.log("Check me", result.name);
        if (err)
        {
            return next(err);
        }
        return res.json({'tasks': req.body, 'name':result.name} );
    });
});

router.post('/edit', function (req,res,next)
{
    var query= req.body.id ;
    var update= {name:req.body.name};
   Task.findByIdAndUpdate(query, update, function (err, tasksTOBeUpdated)
    {
        if (err) {
            return next(new Error('Unable to update the task: ' + tasksTOBeUpdated.name));
        }
        res.json(req.body.name);

    });
});
// updates a single task as done on click event of done button;
router.post('/done', function (req, res,next )
{
    console.log("ID", req.body.id);
    var update= {done:true};
    Task.findByIdAndUpdate(req.body.id, update,function(err, tasks)
    {
        console.log("Tasks", tasks);
        if (err)
        {
            return next(err);
        }
        res.json(tasks);
    })

});
/* Mark all tasks as done. */
router.post('/markedalldone', function(req, res, next)
{
    console.log("Mark all done req.body");

    Task.update( {done:false}, {done:true}, {multi:true}, function(err, tasks){

        if (err)
        {
            return next(err);
        }
       res.redirect('/')

    });
});

router.post('/CompletedAsNew', function (req, res,next )
{
    console.log("ID", req.body.id);
    var update= {done:false};
    Task.findByIdAndUpdate(req.body.id, update,function(err, tasks)
    {
        console.log("Tasks", tasks);
        if (err)
        {
            return next(err);
        }
        res.json(tasks);
    })

});
// /*get all done tasks */
// router.get('/all_done_tasks', function(req, res, next)
// {
//     Task.find({done:true}, function(err, all_Done_tasks)
//     {
//         console.log("All done list", all_Done_tasks);
//
//         if (err)
//         {
//             return next(err);
//         }
//         res.send({tasks: all_Done_tasks });
//
//     });
// });

module.exports = router;