function TaskAddViewModel() {
  var self = this;
  self.name = ko.observable("");
  self.taskGroup = ko.observable("");
  self.dueDate = ko.observable("");
  self.headsUp = ko.observable("");
  self.notes = ko.observable("");

  self.clearValues = function() {
    self.name("");
    self.taskGroup("");
    self.dueDate("");
    self.headsUp("");
    self.notes("");
    $("#taskAddErrorMessage").html("");
  }

  self.taskAdd = function() {
    // check if the needed fields are filled
    if (self.name() === "" || self.taskGroup() === "" || self.dueDate() === "") {
      $("#taskAddErrorMessage").html("Please fill in Task, Task Group, and Due Date.");
    }
    else {
      tasksViewModel.taskAdd({
        name: self.name(),
        task_group: self.taskGroup(),
        due_date: getDueDate(self.dueDate()),
        heads_up: getHeadsUp(self.headsUp()),
        notes: self.notes()
      });
    }
  }
}


function TaskEditViewModel() {
  var self = this;
  self.task = null;
  self.name = ko.observable("");
  self.taskGroup = ko.observable("");
  self.dueDate = ko.observable("");
  self.headsUp = ko.observable("");
  self.notes = ko.observable("");

  self.clearValues = function() {
    self.name("");
    self.taskGroup("");
    self.dueDate("");
    self.headsUp("");
    self.notes("");
    $("#taskEditErrorMessage").html("");
  }

  self.setTask = function(task) {
    self.task = task;
    self.name(task.name());
    self.taskGroup(task.taskGroup());
    self.dueDate(task.dueDate());
    self.headsUp((task.headsUp() == null) ? "" : task.headsUp());
    self.notes((task.notes() == null) ? "" : task.notes());
  }

  self.taskEdit = function() {
    // check if the needed fields are filled
    if (self.name() === "" || self.taskGroup() === "" || self.dueDate() === "") {
      $("#taskEditErrorMessage").html("Please fill in Task, Task Group, and Due Date.");
    }
    else {
      tasksViewModel.taskEdit(self.task.uri(), {
        name: self.name(),
        task_group: self.taskGroup(),
        due_date: getDueDate(self.dueDate()),
        heads_up: getHeadsUp(self.headsUp()),
        notes: self.notes()
      });
    }
  }
}


function TaskDeleteViewModel() {
  var self = this;
  self.task = null;
  self.name = ko.observable("");

  self.clearValues = function() {
    self.name("");
    $("#taskDeleteErrorMessage").html("");
  }

  self.setTask = function(task) {
    self.task = task;
    self.name(task.name());
  }

  self.taskDelete = function() {
    tasksViewModel.taskDelete(self.task);
  }
}


getDueDate = function(dueDate) {
  // format date
  var dueDatePieces = dueDate.split("-");
  return dueDatePieces[1] + "-" + dueDatePieces[2] + "-" + dueDatePieces[0];
}

getHeadsUp = function(headsUp) {
  // format date
  if (headsUp !== "") {
    var headsUpPieces = headsUp.split("-");
    return headsUpPieces[1] + "-" + headsUpPieces[2] + "-" + headsUpPieces[0];
  }
  else {
    return "";
  }
}


var taskAddViewModel = new TaskAddViewModel();
var taskEditViewModel = new TaskEditViewModel();
var taskDeleteViewModel = new TaskDeleteViewModel();
ko.applyBindings(taskAddViewModel, $("#taskAdd")[0]);
ko.applyBindings(taskEditViewModel, $("#taskEdit")[0]);
ko.applyBindings(taskDeleteViewModel, $("#taskDelete")[0]);
