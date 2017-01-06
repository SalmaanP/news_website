/**
 * Created by Salmaan on 12/21/2016.
 */

var app = angular.module('app', ['angular.filter']);

app.controller('content_controller', function ($scope, $http) {

    $scope.content = [];
    $scope.category = 'worldnews';
    $scope.pageNo = 1;
    $scope.hasContent = false;
    $scope.loading = true;
    $scope.isSearch = false;
    $scope.searchString = '';

    $scope.pagination = function(isSearch, category, pageNo, searchString, right){

        if(isSearch){
            $scope.search(category, searchString, pageNo);
        } else {
            $scope.getData(category, pageNo, right);
        }

    };

    $scope.getData = function (category, pageNo, right) {

        $scope.loading = true;

        $http({
            method: 'GET',
            url: '/getData/' + category + '/' + pageNo
        })
            .then(function (res) {

                    console.log(res);
                    $scope.content = res.data;
                    $scope.isSearch = false;

                    if ($scope.category != category) {
                        $('#jumbotron').removeClass('animated lightSpeedIn').addClass('animated lightSpeedIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                            $(this).removeClass('animated lightSpeedIn');
                        });
                    }

                    $scope.category = category;
                    $scope.pageNo = pageNo;
                    $scope.NumContent = $scope.content.length;
                    $scope.NumRows = Array.apply(null, new Array(Math.ceil($scope.NumContent / 3))).map(function (x, i) {
                        return i + 1;
                    });
                    changeClass(category);
                    $scope.hasContent = $scope.NumContent > 0;


                    if (!right) {
                        $('#mainContent').removeClass('animated slideInLeft').addClass('animated slideInLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                            $(this).removeClass('animated slideInLeft');
                        });
                    } else {
                        $('#mainContent').removeClass('animated slideInRight').addClass('animated slideInRight').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                            $(this).removeClass('animated slideInRight');
                        });
                    }


                }
                , function (err) {
                    console.log(err);
                })

            .finally(function () {
                $scope.loading = false;
            });
    };

    $scope.init = function () {
        $scope.getData('worldnews', 1);
        $scope.modalTitle = "Hey There!";
        $scope.modalDomain = "Thanks!";
        $scope.modalKeypoints = ["Not so fast!", "I've taken care of this!"];
        $scope.modalPermalink = "http://salmaan.me";
        $scope.modalUrl = "http://salmaan.me";
    };

    $scope.clicked = function (item) {


        $scope.modalTitle = $scope.content[item].title;
        $scope.modalDomain = $scope.content[item].domain;
        $scope.modalKeypoints = $scope.content[item].keypoints;
        $scope.modalPermalink = $scope.content[item].permalink;
        $scope.modalUrl = $scope.content[item].url;
        $scope.modalScore = $scope.content[item].score;
        $scope.modalNumComments = $scope.content[item].num_comments;
    };

    $scope.search = function (category, searchString, pageNo) {

        $scope.loading = true;
        $scope.pageNo = pageNo;
        $scope.category = category;
        $scope.searchString = searchString;

        console.log(category, searchString);
        $http({
            method: 'get',
            url: '/search/' + searchString + '/' + category + '/' + pageNo
        })
            .then(function (res) {
                    console.log(res);
                    $scope.isSearch = true;
                    $scope.content = res.data;
                    $scope.category = category;
                    $scope.NumContent = $scope.content.length;
                    $scope.NumRows = Array.apply(null, new Array(Math.ceil($scope.NumContent / 3))).map(function (x, i) {
                        return i + 1;
                    });
                    $scope.hasContent = $scope.content.length != 0;
                    $('#mainContent').removeClass('animated slideInLeft').addClass('animated slideInLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                        $(this).removeClass('animated slideInLeft');
                    });
                },
                function (err) {
                    console.log(err);
                }).finally(function () {
            $scope.loading = false;
        });

    };

    function changeClass(category) {
        $scope.navbar_india = "";
        $scope.navbar_worldnews = "";
        $scope.navbar_technology = "";
        $scope.navbar_science = "";
        eval('$scope.navbar_' + category + ' = "active"');
    }

    $scope.setTheme = function(theme){

        if(theme === 'dark'){
            document.getElementById('csstheme').href = "stylesheets/bootstrapdark.min.css";
        } else if(theme === 'light'){
            document.getElementById('csstheme').href = "stylesheets/bootstraplight.min.css";
        }

        $http({
            method: 'GET',
            url: '/setSession/'+theme
        })
            .then(function(res){
                console.log('done');
            })

    };

    console.log('ok');

});