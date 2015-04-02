angular.module('userInfo', ['ui.router'])
.controller('LoginCtrl', [
  '$scope',
  function($scope) {
    $scope.sendUserInfo = function() {
      if ($scope.userName === '') {return;}
      if ($scope.passWord === '') {return;}
      var UserInfo = { 
	username: $scope.userName,
	password: $scope.passWord
      }
      return $http.post('/login', UserInfo);
    };
  }
]);
