/**
 * Created by Salmaan on 5/31/2017.
 */

var mongoose = require('mongoose');

var unitedkingdomSchema = new mongoose.Schema({

    permalink: String,
    title: String,
    url: String,
    domain: String,
    source: String,
    keypoints: [String],
    num_comments: Number,
    article_text: String,
    article_meta: String,
    summary: String,
    pub_date: String,
    reddit_id: String,
    date_added: Date

});

var unitedkingdom = mongoose.model('unitedkingdom', unitedkingdomSchema, 'unitedkingdom');
module.exports = unitedkingdom;
