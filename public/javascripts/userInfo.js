angular.module('userInfo', [])
.controller('LoginCtrl', [
  '$scope',
  '$http',
  '$location',
  function($scope, $http) {
    $scope.sendUserInfo = function() {
      if ($scope.userName === '') {return;}
      if ($scope.passWord === '') {return;}
      var UserInfo = { 
	username: $scope.userName,
	password: $scope.passWord
      }
       return $http.post('/login', UserInfo);
	   //.success(function() {
		//	   $location.url('/');
	   //});
    };
  }
])
.controller('SignupCtrl', [
  '$scope',
  '$http',
  function($scope, $http) {
    $scope.sendUserInfo = function() {
      if ($scope.userName === '') {return;}
      if ($scope.passWord === '') {return;}
      if ($scope.email === '') {return;}
      var UserInfo = {
        username: $scope.userName,
        password: $scope.passWord,
	email: $scope.email
      }
      return $http.post('/signup', UserInfo);
    };
  }
])

