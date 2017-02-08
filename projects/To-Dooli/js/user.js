function UserLoginViewModel() {
  var self = this;
  self.username = ko.observable("");
  self.password = ko.observable("");

  self.clearValues = function() {
    self.username("");
    self.password("");
    $("#userLoginErrorMessage").html("");
  }

  self.userLogin = function() {
    // check if all fields are filled
    if (self.username() === "" || self.password() === "") {
      $("#userLoginErrorMessage").html("All inputs need to be filled.");
    }
    else {
      tasksViewModel.userLogin({
        name: self.username(),
        password: self.password()
      });
    }
  }

  self.userCreate = function() {
    tasksViewModel.openUserCreate();
  }
}


function UserCreateViewModel() {
  var self = this;
  self.username = ko.observable("");
  self.password = ko.observable("");
  self.verifyPassword = ko.observable("");

  self.clearValues = function() {
    self.username("");
    self.password("");
    self.verifyPassword("");
    $("#userCreateErrorMessage").html("");
  }

  self.userCreate = function() {
    // check if passwords match
    if (self.password() !== self.verifyPassword()) {
      $("#userCreateErrorMessage").html("The passwords didn't match.");
      self.password("");
      self.verifyPassword("");
    }
    // check if all fields are filled
    else if (self.username() === "" || self.password() === "" || self.verifyPassword() === "") {
      $("#userCreateErrorMessage").html("All inputs need to be filled.");
    }
    else {
      tasksViewModel.userCreate({
        name: self.username(),
        password: self.password()
      });
    }
  }
}


function UserEditNameViewModel() {
  var self = this;
  self.user = null;
  self.newUsername = ko.observable("");

  self.setUser = function(user) {
    self.user = user;
  }

  self.clearValues = function() {
    self.newUsername("");
    $("#userEditNameErrorMessage").html("");
  }

  self.userUpdate = function() {
    if (self.newUsername() === "") {
      $("#userEditNameErrorMessage").html("Please enter a new username.");
    }
    else if (self.newUsername() === self.user.name) {
      $("#userEditNameErrorMessage").html("That is your current username.");
    }
    else {
      tasksViewModel.userUpdate(self.user.userURI, {
        name: self.newUsername()
      }, 'username');
    }
  }
}


function UserEditPasswordViewModel() {
  var self = this;
  self.user = null;
  self.newPassword = ko.observable("");
  self.verifyNewPassword = ko.observable("");

  self.setUser = function(user) {
    self.user = user;
  }

  self.clearValues = function() {
    self.newPassword("");
    self.verifyNewPassword("");
    $("#userEditPasswordErrorMessage").html("");
  }

  self.userUpdate = function() {
    if (self.newPassword() === "" || self.verifyNewPassword() === "") {
      $("#userEditPasswordErrorMessage").html("All inputs need to be filled.");
    }
    else if (self.newPassword() !== self.verifyNewPassword()) {
      $("#userEditPasswordErrorMessage").html("The passwords didn't match.");
      self.newPassword("");
      self.verifyNewPassword("");
    }
    else {
      tasksViewModel.userUpdate(self.user.userURI, {
        password: self.newPassword()
      }, 'password');
    }
  }
}


function UserEditVisionViewModel() {
  var self = this;
  self.user = null;
  self.vision = ko.observable("");

  self.setUser = function(user) {
    self.user = user;
    self.vision(user.vision)
  }

  self.clearValues = function() {
    self.vision("");
    $("#userEditVisionErrorMessage").html("");
  }

  self.userUpdate = function() {
    if (self.vision() === "") {
      $("#userEditVisionErrorMessage").html("Please provide a value.");
    }
    else {
      tasksViewModel.userUpdate(self.user.userURI, {
        vision: parseInt(self.vision())
      }, 'vision');
    }
  }
}


function UserDeleteViewModel() {
  var self = this;
  self.user = null;

  self.clearValues = function() {
    $("#userDeleteErrorMessage").html("");
  }

  self.setUser = function(user) {
    self.user = user;
  }

  self.userDelete = function() {
    tasksViewModel.userDelete(self.user.userURI);
  }
}


var userLoginViewModel = new UserLoginViewModel();
var userCreateViewModel = new UserCreateViewModel();
var userDeleteViewModel = new UserDeleteViewModel();
var userEditNameViewModel = new UserEditNameViewModel();
var userEditPasswordViewModel = new UserEditPasswordViewModel();
var userEditVisionViewModel = new UserEditVisionViewModel();
ko.applyBindings(userLoginViewModel, $("#userLogin")[0]);
ko.applyBindings(userCreateViewModel, $("#userCreate")[0]);
ko.applyBindings(userDeleteViewModel, $("#userDelete")[0]);
ko.applyBindings(userEditNameViewModel, $("#userEditName")[0]);
ko.applyBindings(userEditPasswordViewModel, $("#userEditPassword")[0]);
ko.applyBindings(userEditVisionViewModel, $("#userEditVision")[0]);
