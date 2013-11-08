angular.module('issues', ['firebase']).
  value('fbURL', 'https://livmadsen-sample.firebaseio.com/issues/').
  factory('Issues', function(angularFireCollection, fbURL) {
    return angularFireCollection(fbURL);
  }).
  config(function($routeProvider) {
    $routeProvider.
      when('/', {controller:ListCtrl, templateUrl:'list.html'}).
      when('/edit/:issueId', {controller:EditCtrl, templateUrl:'detail.html'}).
      when('/new', {controller:CreateCtrl, templateUrl:'detail.html'}).
      otherwise({redirectTo:'/'});
  });
 
function ListCtrl($scope, Issues) {
  $scope.issues = Issues;
}
 
function CreateCtrl($scope, $location, $timeout, Issues) {
  $scope.save = function() {
    Issues.add($scope.issue, function() {
      $timeout(function() { $location.path('/'); });
    });
  }
}
 
function EditCtrl($scope, $location, $routeParams, angularFire, fbURL) {
  angularFire(fbURL + $routeParams.issueId, $scope, 'remote', {}).
  then(function() {
    $scope.issue = angular.copy($scope.remote);
    $scope.issue.$id = $routeParams.issueId;
    $scope.isClean = function() {
      return angular.equals($scope.remote, $scope.issue);
    }
    $scope.destroy = function() {
      $scope.remote = null;
      $location.path('/');
    };
    $scope.save = function() {
      $scope.remote = angular.copy($scope.issue);
      $location.path('/');
    };
  });
}