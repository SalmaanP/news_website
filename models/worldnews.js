/**
 * Created by Salmaan on 12/21/2016.
 */


var mongoose = require('mongoose');

var worldnewsSchema = new mongoose.Schema({

    permalink: String,
    title: String,
    url: String,
    domain: String,
    keypoints: [String],
    source: String,
    num_comments: Number,
    article_text: String,
    article_meta: String,
    summary: String,
    pub_date: String,
    reddit_id: String,
    date_added: Date

});

var worldnews = mongoose.model('worldnews', worldnewsSchema, 'worldnews');
module.exports = worldnews;
