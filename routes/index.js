var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

/* GET home page. */
router.get('/', function(req, res, next)
{
  //.find() gets all the documents inside a collection
  req.db.collection('tasks').find().toArray(function (err, taskDocs)
  {
    console.log(taskDocs);
    if (err) {
      return next(err)
    }
    else {
      return res.render('index', {title: 'TO DO List', places: taskDocs}); // placesdocs contains all object items
    }
  });

});

/* GET all items home page. */
router.get('/all', function(req, res)
{
  req.db.collection('tasks').find().toArray(function (err, taskDocs) {
    console.log(taskDocs);
    res.json(taskDocs); // returns Json object
  });
});
//
/// need to look into this
/* POST - add a new location */
router.post('/add', function(req, res, next)
{
  //var counter= req.db.collection('places').find().count();
  // gives a total number if any place already exists
  req.db.collection('tasks').find({'name':req.body.name}).toArray( function (err, doc)
  {
    console.log(req.body.name);
    console.log("Here" + doc);
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

module.exports = router;