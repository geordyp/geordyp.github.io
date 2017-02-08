function TasksViewModel() {
  var self = this;
  self.loginURI = "http://138.197.77.126/ondeck/api/v1.0/user/login";
  self.registerUserURI = "http://138.197.77.126/ondeck/api/v1.0/user";
  self.serverLogin = {
    username: "geordypaul",
    password: "123wegonbealright456789"
  };

  self.user = ko.observable(null);
  self.tasks = ko.observableArray([]);
  self.doneView = ko.observable(null);
  var currentView = "";

  self.openUserLogin = function() {
    $("#userLogin").modal("show");
    userLoginViewModel.clearValues();
  }

  self.openUserCreate = function() {
    $("#userCreate").modal("show");
    userCreateViewModel.clearValues();
  }

  self.openUserEditName = function() {
    $("#userEditName").modal("show");
    userEditNameViewModel.clearValues();
    userEditNameViewModel.setUser(self.user());
  }

  self.openUserEditPassword = function() {
    $("#userEditPassword").modal("show");
    userEditPasswordViewModel.clearValues();
    userEditPasswordViewModel.setUser(self.user());
  }

  self.openUserEditVision = function() {
    $("#userEditVision").modal("show");
    userEditVisionViewModel.clearValues();
    userEditVisionViewModel.setUser(self.user());
  }

  self.openUserDelete = function() {
    $("#userDelete").modal("show");
    userDeleteViewModel.clearValues();
    userDeleteViewModel.setUser(self.user());
  }

  self.openTaskAdd = function() {
    $("#taskAdd").modal("show");
  }

  self.openTaskEdit = function(task) {
    $("#taskEdit").modal("show");
    taskEditViewModel.setTask(task);
  }

  self.openTaskDelete = function(task) {
    $("#taskDelete").modal("show");
    taskDeleteViewModel.setTask(task);
  }

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
        // console.error("ajax error: " + jqXHR.responseText);
      }
    };
    return $.ajax(request);
  }

  self.userLogin = function(user) {
    self.ajax(self.loginURI, "POST", user).done(function(data) {
      $("#userLogin").modal("hide");
      self.user(data.user[0]);
      self.getActiveTasks();
    }).fail(function(jqXHR) {
      // console.error(jqXHR);
      if (jqXHR.responseText.includes("Invalid login")) {
        $("#userLoginErrorMessage").html("Incorrect username or password.");
        userLoginViewModel.password("");
      }
      else {
        $("#userLoginErrorMessage").html("We couldn't log into your account. Please try again.");
      }
    });
  }

  self.userLogout = function() {
    self.user(null);
    self.tasks([]);
  }

  self.userCreate = function(user) {
    self.ajax(self.registerUserURI, "POST", user).done(function(data) {
      $("#userCreate").modal("hide");
      userCreateViewModel.clearValues();
      self.user(data.user[0]);
      self.getActiveTasks();
    }).fail(function(jqXHR) {
      // console.error(jqXHR);
      if (jqXHR.responseText.includes("Invalid username")) {
        $("#userCreateErrorMessage").html("Invalid username.");
      }
      else if (jqXHR.responseText.includes("Invalid password")) {
        $("#userCreateErrorMessage").html("Invalid password.");
        userCreateViewModel.password("");
        userCreateViewModel.verifyPassword("");
      }
      else if (jqXHR.responseText.includes("Username is taken")) {
        $("#userCreateErrorMessage").html("That username is taken.");
      }
      else {
        $("#userCreateErrorMessage").html("We couldn't create the account. Please try again.");
      }
    });
  }

  self.userUpdate = function(userURI, data, setting) {
    self.ajax(userURI, 'PUT', data).done(function(data) {
      if (setting === 'username') {
        $('#userEditName').modal('hide');
        userEditNameViewModel.clearValues();
      }
      else if (setting === 'password') {
        $('#userEditPassword').modal('hide');
        userEditPasswordViewModel.clearValues();
      }
      else if (setting === 'vision') {
        $('#userEditVision').modal('hide');
        userEditVisionViewModel.clearValues();
      }
      self.user(data.user[0]);
    }).fail(function(jqXHR) {
      // console.error(jqXHR);
      if (jqXHR.responseText.includes("Invalid username")) {
        $("#userEditNameErrorMessage").html("Invalid username.");
      }
      else if (jqXHR.responseText.includes("Username is taken")) {
        $("#userEditNameErrorMessage").html("That username is taken.");
      }
      else if (jqXHR.responseText.includes("Invalid password")) {
        userEditPasswordViewModel.clearValues();
        $("#userEditPasswordErrorMessage").html("Invalid password.");
      }
      else if (jqXHR.responseText.includes("Invalid on deck setting")) {
        $("#userEditVisionErrorMessage").html("Invalid on deck setting.");
      }
      else {
        if (setting === 'username') {
          $("#userEditNameErrorMessage").html("We couldn't update the account. Please try again.");
        }
        else if (setting === 'password') {
          $("#userEditPasswordErrorMessage").html("We couldn't update the account. Please try again.");
        }
        else if (setting === 'vision') {
          $("#userEditVisionErrorMessage").html("We couldn't update the account. Please try again.");
        }
      }
    });
  }

  self.userDelete = function(userURI) {
    self.ajax(userURI, 'DELETE').done(function() {
      $('#userDelete').modal('hide');
      self.user(null);
      self.tasks([]);
    }).fail(function(jqXHR) {
      // console.error(jqXHR);
      $("#userDeleteErrorMessage").html("We couldn't delete your account. Please try again.");
    });
  }

  self.taskAdd = function(task) {
    self.ajax(self.user().createTaskURI, "POST", task).done(function(data) {
      $("#taskAdd").modal("hide");
      taskAddViewModel.clearValues();
      self.tasks([]);
      self.getActiveTasks();
    }).fail(function(jqXHR) {
      // console.error(jqXHR);
      if (jqXHR.responseText.includes("Invalid task name")) {
        $("#taskAddErrorMessage").html("Invalid task name.");
      }
      else if (jqXHR.responseText.includes("Invalid task group")) {
        $("#taskAddErrorMessage").html("Invalid task group.");
      }
      else if (jqXHR.responseText.includes("Invalid due date")) {
        $("#taskAddErrorMessage").html("Invalid due date.");
      }
      else if (jqXHR.responseText.includes("Invalid heads up")) {
        $("#taskAddErrorMessage").html("Invalid add to on deck date.");
      }
      else if (jqXHR.responseText.includes("Invalid notes")) {
        $("#taskAddErrorMessage").html("Invalid notes.");
      }
      else {
        $("#taskAddErrorMessage").html("We couldn't create the task. Please try again.");
      }
    });
  }

  self.taskEdit = function(taskURI, task) {
    self.ajax(taskURI, 'PUT', task).done(function(data) {
        $('#taskEdit').modal('hide');
        taskEditViewModel.clearValues();

        self.tasks([]);
        if (currentView === "active") self.getActiveTasks();
        else if (currentView === "ondeck") self.getOnDeckTasks();
        else self.getDoneTasks();
    }).fail(function(jqXHR) {
      // console.error(jqXHR);
      if (jqXHR.responseText.includes("Invalid task name")) {
        $("#taskEditErrorMessage").html("Invalid task name.");
      }
      else if (jqXHR.responseText.includes("Invalid task group")) {
        $("#taskEditErrorMessage").html("Invalid task group.");
      }
      else if (jqXHR.responseText.includes("Invalid due date")) {
        $("#taskEditErrorMessage").html("Invalid due date.");
      }
      else if (jqXHR.responseText.includes("Invalid heads up")) {
        $("#taskEditErrorMessage").html("Invalid add to on deck date.");
      }
      else if (jqXHR.responseText.includes("Invalid notes")) {
        $("#taskEditErrorMessage").html("Invalid notes.");
      }
      else {
        $("#taskEditErrorMessage").html("We couldn't update the task. Please try again.");
      }
    });
  }

  self.taskDelete = function(task) {
    self.ajax(task.uri(), 'DELETE').done(function() {
      $('#taskDelete').modal('hide');
      taskDeleteViewModel.clearValues();

      var taskList = self.tasks();
      var index = taskList.indexOf(task);
      taskList.splice(index, 1);
      self.tasks(taskList);
    }).fail(function(jqXHR) {
      // console.error(jqXHR);
      $("#taskDeleteErrorMessage").html("We couldn't delete the task. Please try again.");
    });
  }

  self.taskToggleDone = function(task) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if (dd<10) {dd='0'+dd;}
    if (mm<10) {mm='0'+mm;}

    var todayStr = mm + "-" + dd + "-" + yyyy;
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
      var taskList = self.tasks();
      var index = taskList.indexOf(task);
      taskList.splice(index, 1);
      self.tasks(taskList);
    }).fail(function(jqXHR) {
      // console.error(jqXHR);
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
        var dueDate = new Date(data.tasks[i].due_date)
        var dueDateString = getDayString(dueDate.getUTCDay()) + " " + getMonthString(dueDate.getMonth()) + " " + dueDate.getUTCDate();
        self.tasks.push({
          name: ko.observable(data.tasks[i].name),
          taskGroup: ko.observable(data.tasks[i].task_group),
          notes: ko.observable(data.tasks[i].notes),
          dueDateString: ko.observable(dueDateString),
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

  getDayString = function(d) {
    switch (d) {
      case 0:
        return "Sun";
      case 1:
        return "Mon";
      case 2:
        return "Tue";
      case 3:
        return "Wed";
      case 4:
        return "Thu";
      case 5:
        return "Fri";
      case 6:
        return "Sat";
      default:
        // console.error("day out of range");
        return;
    }
  }

  getMonthString = function(m) {
    switch (m) {
      case 0:
        return "Jan";
      case 1:
        return "Feb";
      case 2:
        return "Mar";
      case 3:
        return "Apr";
      case 4:
        return "May";
      case 5:
        return "Jun";
      case 6:
        return "Jul";
      case 7:
        return "Aug";
      case 8:
        return "Sep";
      case 9:
        return "Oct";
      case 10:
        return "Nov";
      case 11:
        return "Dec";
      default:
        // console.error("month out of range");
        return;
    }
  }

  self.openUserLogin();
}


var tasksViewModel = new TasksViewModel();
ko.applyBindings(tasksViewModel, $("#main")[0]);

$(document).ready(function(){
    $("[data-toggle='popover']").popover();
});
