// Enable Node.js Core library if require does not work;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Represents a Task data:-a name, a date task is assigned and completed boolean; */
var TaskSchema = new Schema({
    name : { type: String,
        required: true,
        unique: true},
    done:Boolean
});
// mongoose.model turns it into a Run object - uppercase first letter
var Task = mongoose.model('Task', TaskSchema);

module.exports = Task;