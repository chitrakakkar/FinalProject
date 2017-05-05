var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Task = require('../models/task'); // grabs schema from the task.js;no more db.collection


/* GET home page. */
router.get('/', function(req, res, next)
{
  //.find() gets all the documents inside a collection
  Task.find({done:false}, function (err, taskDocs)
  {
    console.log("Check me",taskDocs);
    if (err) {
      return next(err)
    }
    else {
      res.render('index', {title: 'To Do List', tasks: taskDocs}); // tasksDocs contains all object items
    }
  })
});

/* GET all items home page. */
router.get('/all', function(req, res)
{
  Task.find({done:false} , function (err, taskDocs)
  {
    console.log(taskDocs);
    res.json(taskDocs); // returns Json object
  })
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
        res.send(req.body.name);

    });
});
// router grabs the complated task from the mongoose database
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
        res.send(tasks.name);
        //res.render('done_tasks', {title: 'Done Tasks', tasks: tasks });
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
router.get('/done_tasks', function(req, res, next)
{
    Task.find({done:true}, function(err, all_Done_tasks)
    {

        if (err)
        {
            return next(err);
        }
        //req.flash('info', 'All tasks are done!');
        res.send({tasks: all_Done_tasks });

    });
});

module.exports = router;