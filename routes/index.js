var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Task = require('../models/task.js'); // grabs schema from the task.js;no more db.collection


/* GET home page. */
router.get('/', function(req, res, next)
{
  //.find() gets all the documents inside a collection
  req.db.collection('tasks').find().toArray(function (err, taskDocs)
  {
    console.log("Check me",taskDocs);
    if (err) {
      return next(err)
    }
    else {
      return res.render('index', {title: 'TO DO List', places: taskDocs}); // tasksDocs contains all object items
    }
  });

});

/* GET all items home page. */
router.get('/all', function(req, res)
{
  req.db.collection('tasks').find().toArray(function (err, taskDocs)
  {
    console.log(taskDocs);
    res.json(taskDocs); // returns Json object
  });
});

router.post('/add', function(req, res, next)
{
    console.log("I am the body", req.body);
  //var counter= req.db.collection('places').find().count();
  // gives a total number if any place already exists
  req.db.collection('tasks').find({'name':req.body.name}).toArray( function (err, doc)
  {
    console.log("I am the name", req.body.name);

    // gives the number of duplicate entry
    //checks if the list for the place's name is 0;then add it else give an error message
    if(doc.length == 0)
    {

      req.db.collection('tasks').insertOne({'name':req.body.name}, function (err,docs)
      {
        if (err)
        {
          return next(err);
        }
        return res.json(docs.ops[0]); // directs to home-page
      });
    }
    else {
      res.send("Duplicate Entry");

    }
  });
});
// router grabs the completed task from the mongoose database
router.get('/completed', function (req, res,next )
{
    Task.find({done:true},function(err, tasks)
    {
        if (err) {
            return next(err);
        }
        res.render('done_tasks', {title: 'Completed Tasks', tasks: tasks});
    })

});
//delete a task;
router.post('/delete', function (req, res, next)
{
    // req.body has id ;not _id;
    req.db.collection('tasks').deleteOne({'_id':ObjectID(req.body.id)},function (err)
    {
        if (err)
        {
            return next(err);
        }
        return res.render('delete_task.hbs',{'tasks': req.body} ); // directs to delete-page
    });
});

router.post('/edit', function (req,res,next)
{
    var query= { '_id' : ObjectID(req.body.id)};
    var update= {name:req.body.name};
    req.db.collection('tasks').findOneAndUpdate(query, update, function (err, tasksTOBeUpdated)
    {
        if (err) {
            return next(new Error('Unable to update the task: ' + tasksTOBeUpdated.name));
        }
        res.status(503);
        res.send(req.body.name);

    });


});
module.exports = router;