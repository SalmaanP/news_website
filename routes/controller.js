/**
 * Created by Salmaan on 12/21/2016.
 */


var redis = require('redis');
//var client = redis.createClient();
var client = require('redis').createClient(6379, "news.wcekgc.0001.usw2.cache.amazonaws.com");
var india = require('../models/india');
var worldnews = require('../models/worldnews');
var science = require('../models/science');
var technology = require('../models/technology');

client.on('ready', function () {

    console.log("Redis Ready");

});

client.on('error', function (err) {
    console.log("Error " + err);
});

exports.redisCron = function () {

    client.expireat("news", 0);
    client.expireat("search", 0);

};

exports.getData = function (request, response) {

    var category = String(request.params.category).toLowerCase();
    var pageNo = parseInt(request.params.pageNo);

    if (pageNo < 1) {
        response.status(400);
        response.end("Invalid Parameters!!");
        return;
    }

    pageNo -= 1;


    var collection = getCategory(category);

    if (!collection) {
        response.status(400);
        response.end("Invalid Request");
        return;
    }


    var redisKey = String(category) + String(pageNo);
    console.log(redisKey);

    if (client.connected) {

        client.hget("news", redisKey, function (err, result) {

            if (result) {
                console.log("From redis");
                // obj=JSON.parse(result);
                response.end(result);
                return;
            }

            if (err || !result) {
                if (err)
                    console.log(err);
                console.log("redis error or none");
                fetchData(collection, pageNo, redisKey, request, response);

            }

        });
    } else {
        console.log("redis not connected");
        fetchData(collection, pageNo, redisKey, request, response);

    }


};

exports.newSearch = function(request, response){


    var category = String(request.params.category).toLowerCase();
    var pageNo = parseInt(request.params.pageNo);
    var searchString = String(request.params.searchString).toLowerCase();

    if (pageNo < 1) {
        response.status(400);
        response.end("Invalid Parameters!!");
        return;
    }

    pageNo -= 1;

    var collection = getCategory(category);

    if (!collection) {
        response.status(400);
        response.end("Invalid Request");
        return;
    }

    var redisKey = String(category) + String(searchString) + String(pageNo);

    if (client.connected) {

        client.hget("search", redisKey, function (err, result) {

            if (result) {
                console.log("New Search from redis");
                // obj=JSON.parse(result);
                response.end(result);
                return;
            }

            if (err || !result) {
                if (err)
                    console.log(err);
                console.log("redis error or none in new search");
                fetchNewSearch(collection, searchString, redisKey, pageNo, request, response);
            }

        });
    } else {
        console.log("new search redis not connected");
        fetchNewSearch(collection, searchString, redisKey, pageNo, request, response);

    }

};

exports.search = function (request, response) {

    var category = request.body.category;
    var searchString = String(request.body.searchString).toLowerCase();
    var pageNo = parseInt(request.body.pageNo);

    console.log(searchString, category);

    var collection = getCategory(category);

    if (!collection) {
        response.status(400);
        response.end("Invalid Request");
        return;
    }

    var redisKey = String(category) + String(searchString);

    if (client.connected) {

        client.hget("search", redisKey, function (err, result) {

            if (result) {
                console.log("Search from redis");
                // obj=JSON.parse(result);
                response.end(result);
                return;
            }

            if (err || !result) {
                if (err)
                    console.log(err);
                console.log("redis error or none in search");
                fetchSearch(collection, searchString, redisKey, pageNo, request, response);
            }

        });
    } else {
        console.log("redis not connected");
        fetchSearch(collection, searchString, redisKey, pageNo, request, response);

    }

};

exports.saved = function(request, response){

    fetchSaved()

};

function fetchData(collection, pageNo, redisKey, request, response) {

    collection
        .find()
        .sort({"date_added": -1, "score": -1})
        .skip(pageNo * 18)
        .limit(18)
        .exec(function (err, res) {
            if (!err) {
                client.hmset("news", redisKey, JSON.stringify(res), redis.print);
                response.end(JSON.stringify(res));

            } else {
                console.log(err);
                response.status(500);
                response.end();
            }
        });
}

function fetchSearch(collection, searchString, redisKey, pageNo, request, response) {

    collection
        .find({'article_text': {$regex: searchString, $options: 'i'}})
        .sort({'date_added': -1, "score": -1})
        .limit(18)
        .exec(function (err, res) {

            if (!err) {
                client.hmset("search", redisKey, JSON.stringify(res), redis.print);
                response.send(JSON.stringify(res));
            } else {
                console.log(err);
                response.status(500);
                response.end();
            }
        });


}

function fetchNewSearch(collection, searchString, redisKey, pageNo, request, response) {

    collection
        .find({'article_text': {$regex: searchString, $options: 'i'}})
        .sort({'date_added': -1, "score": -1})
        .skip(pageNo * 18)
        .limit(18)
        .exec(function (err, res) {

            if (!err) {
                client.hmset("search", redisKey, JSON.stringify(res), redis.print);
                response.send(JSON.stringify(res));
            } else {
                console.log(err);
                response.status(500);
                response.end();
            }
        });


}

function fetchSaved(collection, idArray, request, response){

    collection
        .where({"reddit_id": { $in: idArray}})
        .exec(function(err, res){
            if(!err){
                response.send(JSON.stringify(res));
            } else {
                console.log(err);
                response.status(500);
                response.end();
            }
        });

}


exports.setSession = function(request, response){

    var theme = String(request.params.theme).toLowerCase();
    if(theme === 'dark')
        request.session.theme = 'dark';
    else if(theme === 'light')
        request.session.theme = 'light';
    response.end();

};

function getCategory(category) {
    switch (category) {

        case 'india':
            collection = india;
            break;
        case 'worldnews':
            collection = worldnews;
            break;
        case 'science':
            collection = science;
            break;
        case 'technology':
            collection = technology;
            break;
        default:
            collection = null;
            break;
    }

    return collection;
}

