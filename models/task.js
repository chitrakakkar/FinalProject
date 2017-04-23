// Enable Node.js Core library if require does not work;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Represents a Task data:-a name, and a date task is assigned; */
var TaskSchema = new mongoose.Schema({
    name : { type: String,
        required: true,
        unique: true},

    date: {
            type: Date, default: Date.now, validate:
            {
                <!-- validating if date is in past; -->
                validator:function (date) {
                    //return false if date is in future
                    return (date <Date.now());
                }, message:'{VALUE} is not a valid task date.Date must be in past'
            }
        }
});
// mongoose.model turns it into a Run object - uppercase first letter
var Task = mongoose.model('Task', TaskSchema);

module.exports = Task;