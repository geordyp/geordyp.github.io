function TasksViewModel() {
  var self = this;
  self.loginURI = "http://138.197.77.126/ondeck/api/v1.0/user/login";
  self.registerUserURI = "http://138.197.77.126/ondeck/api/v1.0/user";
  self.serverLogin = {
    username: "geordypaul",
    password: "Appl3B3ar"
  };

  self.user = ko.observable(null);
  self.tasks = ko.observableArray([]);
  self.doneView = ko.observable(null);
  var currentView = "";

  self.ajax = function(uri, method, data) {
    var request = {
      url: uri,
      type: method,
      contentType: "application/json",
      accepts: "application/json",
      cache: false,
      dataType: "json",
      data: JSON.stringify(data),
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization",
                             "Basic " + btoa(self.serverLogin.username + ":" + self.serverLogin.password));
      },
      error: function(jqXHR) {
        console.log("ajax error: " + jqXHR.responseText);
      }
    };
    return $.ajax(request);
  }

  self.openLogin = function() {
    $("#login").modal("show");
  }

  self.login = function(user) {
    self.ajax(self.loginURI, "POST", user).done(function(data) {
      $("#login").modal("hide");
      self.user(data.user[0])
      self.getActiveTasks()
    }).fail(function(jqXHR) {
      $("#loginErrorMessage").html("Incorrect username or password.");
    });
  }

  self.logout = function() {
    self.user(null);
    self.tasks([]);
  }

  self.openUserRegistration = function() {
    $("#createUser").modal("show");
  }

  self.registerUser = function(user) {
    self.ajax(self.registerUserURI, "POST", user).done(function(data) {
      $("#createUser").modal("hide");
      self.user(data.user[0]);
      self.getActiveTasks();
    }).fail(function(jqXHR) {
      console.log(jqXHR);
      if (jqXHR.responseText.includes("This username is taken")) {
        $("#createUserErrorMessage").html("The username is taken.");
      }
      else {
        $("#createUserErrorMessage").html("We couldn't create the account.");
      }
    });
  }

  self.updateUser = function(userURI, data) {
    self.ajax(userURI, 'PUT', data).done(function(data) {
        $('#settings').modal('hide');
        self.user(data.user[0]);
    }).fail(function(jqXHR) {
      console.log(jqXHR);
      $("#editTaskErrorMessage").html("We couldn't update your settings.");
    });
  }

  self.openSettings = function() {
    $("#settings").modal("show");
    userSettingsViewModel.setUser(self.user());
  }

  self.openAdd = function() {
    $("#addTask").modal("show");
  }

  self.addTask = function(task) {
    self.ajax(self.user().createTaskURI, "POST", task).done(function(data) {
      $("#addTask").modal("hide");

      self.tasks([]);
      self.getActiveTasks();
    }).fail(function(jqXHR) {
      console.log(jqXHR);
      $("#addTaskErrorMessage").html("We couldn't create the task.");
    });
  }

  self.openEdit = function(task) {
    $("#editTask").modal("show");
    editTaskViewModel.setTask(task);
  }

  self.editTask = function(taskURI, task) {
    self.ajax(taskURI, 'PUT', task).done(function(data) {
        $('#editTask').modal('hide');

        self.tasks([]);
        if (currentView === "active")
          self.getActiveTasks();
        else if (currentView === "ondeck")
          self.getOnDeckTasks();
        else
          self.getDoneTasks();
    }).fail(function(jqXHR) {
      console.log(jqXHR);
      $("#editTaskErrorMessage").html("We couldn't update the task.");
    });
  }

  self.openDelete = function(task) {
    deleteTaskViewModel.setTask(task);
  }

  self.deleteTask = function(taskURI) {
    self.ajax(taskURI, 'DELETE').done(function() {
      $('#deleteTask').modal('hide');

      self.tasks([]);
      if (currentView === "active")
        self.getActiveTasks();
      else if (currentView === "ondeck")
        self.getOnDeckTasks();
      else
        self.getDoneTasks();
    }).fail(function(jqXHR) {
      console.log(jqXHR);
      $("#deleteTaskErrorMessage").html("We couldn't delete the task.");
    });
  }

  self.toggleDone = function(task) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if (dd<10) {dd='0'+dd;}
    if (mm<10) {mm='0'+mm;}

    var todayStr = yyyy + "-" + mm + "-" + dd;
    if (task.done() === false) {
      data = {
        done: true,
        completion_date: todayStr
      };
    }
    else {
      data = {
        done: false,
        completion_date: ""
      };
    }

    self.ajax(task.uri(), 'PUT', data).done(function(data) {
        self.tasks([]);
        if (currentView === "active")
          self.getActiveTasks();
        else if (currentView === "ondeck")
          self.getOnDeckTasks();
        else
          self.getDoneTasks();
    }).fail(function(jqXHR) {
      console.log(jqXHR);
    });
  }

  self.getActiveTasks = function() {
    $("#pill-active").addClass("active");
    $("#pill-ondeck").removeClass("active");
    $("#pill-done").removeClass("active");
    self.doneView(false);
    currentView = "active";
    self.getTasks(self.user().activeTasksURI)
  }

  self.getOnDeckTasks = function() {
    $("#pill-ondeck").addClass("active");
    $("#pill-active").removeClass("active");
    $("#pill-done").removeClass("active");
    self.doneView(false);
    currentView = "ondeck";
    self.getTasks(self.user().onDeckTasksURI)
  }

  self.getDoneTasks = function() {
    $("#pill-done").addClass("active");
    $("#pill-ondeck").removeClass("active");
    $("#pill-active").removeClass("active");
    self.doneView(true);
    currentView = "done";
    self.getTasks(self.user().doneTasksURI)
  }

  self.getTasks = function(taskURI) {
    self.ajax(taskURI, "GET").done(function(data) {
      self.tasks([])
      for (var i = 0; i < data.tasks.length; i++) {
        self.tasks.push({
          name: ko.observable(data.tasks[i].name),
          commitment: ko.observable(data.tasks[i].commitment),
          notes: ko.observable(data.tasks[i].notes),
          dueDate: ko.observable(data.tasks[i].due_date),
          daysLeft: ko.observable(data.tasks[i].days_left),
          headsUp: ko.observable(data.tasks[i].heads_up),
          done: ko.observable(data.tasks[i].done),
          completionDate: ko.observable(data.tasks[i].completion_date),
          uri: ko.observable(data.tasks[i].uri)
        });
      }
    });
  }

  self.openLogin();
}

function LoginViewModel() {
  var self = this;
  self.username = ko.observable("");
  self.password = ko.observable("");

  self.login = function() {
    tasksViewModel.login({
      name: self.username(),
      password: self.password()
    });

    self.username("");
    self.password("");
  }

  self.createUser = function() {
    tasksViewModel.openUserRegistration();
  }
}


function CreateUserViewModel() {
  var self = this;
  self.username = ko.observable("");
  self.password = ko.observable("");
  self.verifyPassword = ko.observable("");

  self.createUser = function() {
    var reUsername = /^[a-zA-Z0-9]+$/;
    var rePassword = /^.{3,20}$/;

    // validate username
    if (!reUsername.test(self.username())) {
      $("#createUserErrorMessage").html("Invalid username.");
      self.username("");
    }
    // validate password
    else if (!rePassword.test(self.password())) {
      $("#createUserErrorMessage").html("Invalid password.");
      self.password("");
      self.verifyPassword("");
    }
    // check if passwords match
    else if (self.password() !== self.verifyPassword()) {
      $("#createUserErrorMessage").html("The passwords don't match.");
      self.password("");
      self.verifyPassword("");
    }
    // check if all fields are filled
    else if (self.username() === "" || self.password() === "" || self.verifyPassword() === "") {
      $("#createUserErrorMessage").html("All inputs need to be filled.");
    }
    else {
      tasksViewModel.registerUser({
        name: self.username(),
        password: self.password()
      });

      self.username("");
      self.password("");
      self.verifyPassword("");
      $("#createUserErrorMessage").html("");
    }
  }
}


function AddTaskViewModel() {
  var self = this;
  self.name = ko.observable("");
  self.commitment = ko.observable("");
  self.dueDate = ko.observable("");
  self.headsUp = ko.observable("");
  self.notes = ko.observable("");

  self.addTask = function() {
    // check if the needed fields are filled
    if (self.name() === "" || self.commitment() === "" || self.dueDate() === "") {
      $("#addTaskErrorMessage").html("Please fill in Task, Commitment, and Due Date.");
    }
    else {
      console.log(self.dueDate());

      tasksViewModel.addTask({
        name: self.name(),
        commitment: self.commitment(),
        due_date: self.dueDate(),
        heads_up: self.headsUp(),
        notes: self.notes()
      });

      self.name("");
      self.commitment("");
      self.dueDate("");
      self.headsUp("");
      self.notes("");
      $("#addTaskErrorMessage").html("");
    }
  }
}


function EditTaskViewModel() {
  var self = this;
  self.task = null;
  self.name = ko.observable("");
  self.commitment = ko.observable("");
  self.dueDate = ko.observable("");
  self.headsUp = ko.observable("");
  self.notes = ko.observable("");

  self.setTask = function(task) {
    self.task = task;
    self.name(task.name());
    self.commitment(task.commitment());
    self.dueDate(task.dueDate());
    self.headsUp((task.headsUp() == null) ? "" : task.headsUp());
    self.notes((task.notes() == null) ? "" : task.notes());
  }

  self.editTask = function() {
    // check if the needed fields are filled
    if (self.name() === "" || self.commitment() === "" || self.dueDate() === "") {
      $("#editTaskErrorMessage").html("Please fill in Task, Commitment, and Due Date.");
    }
    else {
      tasksViewModel.editTask(self.task.uri(), {
        name: self.name(),
        commitment: self.commitment(),
        due_date: self.dueDate(),
        heads_up: self.headsUp(),
        notes: self.notes()
      });

      self.name("");
      self.commitment("");
      self.dueDate("");
      self.headsUp("");
      self.notes("");
      $("#editTaskErrorMessage").html("");
    }
  }
}


function DeleteTaskViewModel() {
  var self = this;
  self.task = null;
  self.name = ko.observable("");

  self.setTask = function(task) {
    self.task = task;
    self.name(task.name());

    $("#deleteTask").modal("show");
  }

  self.deleteTask = function() {
    tasksViewModel.deleteTask(self.task.uri());
    $("#deleteTaskErrorMessage").html("");
  }
}


function UserSettingsViewModel() {
  var self = this;
  self.user = null;
  self.vision = ko.observable("");

  self.setUser = function(user) {
    self.user = user;
    self.vision(user.vision);
  }

  self.updateUser = function() {
    if (self.vision() === "" || parseInt(self.vision()) > 60 || parseInt(self.vision()) < 1) {
      $("#settingsErrorMessage").html("Please provide a value between 1 and 60 days.");
    }
    else {
      tasksViewModel.updateUser(self.user.userURI, {
        vision: parseInt(self.vision())
      });

      self.vision("");
      $("#settingsErrorMessage").html("");
    }
  }
}


var tasksViewModel = new TasksViewModel();
var loginViewModel = new LoginViewModel();
var createUserViewModel = new CreateUserViewModel();
var userSettingsViewModel = new UserSettingsViewModel();
var addTaskViewModel = new AddTaskViewModel();
var editTaskViewModel = new EditTaskViewModel();
var deleteTaskViewModel = new DeleteTaskViewModel();
ko.applyBindings(tasksViewModel, $("#main")[0]);
ko.applyBindings(loginViewModel, $("#login")[0]);
ko.applyBindings(createUserViewModel, $("#createUser")[0]);
ko.applyBindings(userSettingsViewModel, $("#settings")[0]);
ko.applyBindings(addTaskViewModel, $("#addTask")[0]);
ko.applyBindings(editTaskViewModel, $("#editTask")[0]);
ko.applyBindings(deleteTaskViewModel, $("#deleteTask")[0]);

$(document).ready(function(){
    $("[data-toggle='popover']").popover();
});
