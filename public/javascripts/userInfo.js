angular.module('userInfo', [])
.controller('LoginCtrl', [
  '$scope',
  '$http',
  function($scope, $http) {
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
