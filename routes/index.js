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
      res.render('index', {title: 'TO DO List', tasks: taskDocs}); // tasksDocs contains all object items
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
    // req.body has id ;not _id;
    Task.findByIdAndRemove(req.body.id,function (err)
    {
        if (err)
        {
            return next(err);
        }
        return res.render('delete_tasks.hbs',{'tasks': req.body} ); // directs to delete-page
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
router.get('/done', function (req, res,next )
{
    console.log("ID", req.body.id);
    var update= {done:true};
    Task.findByIdAndUpdate(req.body.id, update,{new: true},function(err, tasks)
    {
        console.log("Tasks", tasks);
        if (err)
        {
            return next(err);
        }
        res.render('done_tasks', {title: 'Done Tasks', tasks: tasks });
    })

});
/* Mark all tasks as done. */
router.post('/alldone', function(req, res, next){

    Task.update( {done:false}, {done:true}, {multi:true}, function(err){

        if (err)
        {
            return next(err);
        }
        req.flash('info', 'All tasks are done!');
        return res.redirect('/')

    });
});

module.exports = router;