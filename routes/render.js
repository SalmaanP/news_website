exports.about = function(request, response){


    if(request.session.theme === 'dark')
        response.render('about', {theme: 'dark'});
    else if(request.session.theme == 'light')
        response.render('about', {theme: 'light'});
    else
        response.render('about', {theme: 'light'});
};

exports.index = function(request, response){

    var theme = "";
    var category = "";
    if(request.session.theme === 'dark'){
        theme = 'dark';
    }
    else if(request.session.theme == 'light'){
        theme ='light';
    }
    else{
        theme ='light';
    }

    category = getCategory(String(request.params.category).toLowerCase());
    console.log(category);
    response.render('index', {theme: theme, category: category});
};

exports.article = function(request, response){

    var theme = "";

    if(request.session.theme === 'dark'){
        theme = 'dark';
    }
    else if(request.session.theme == 'light'){
        theme ='light';
    }
    else{
        theme ='light';
    }

    response.render('article', {theme: theme});


};

exports.unitedstates = function(request, response){

    var theme = "";
    var category = "news";
    if(request.session.theme === 'dark'){
        theme = 'dark';
    }
    else if(request.session.theme == 'light'){
        theme ='light';
    }
    else{
        theme ='light';
    }

    response.render('index', {theme: theme, category: category});
};

function getCategory(category) {
    var Category = "";
    switch (category) {

        case 'india':
            Category = 'india';
            break;
        case 'worldnews':
            Category = 'worldnews';
            break;
        case 'science':
            Category = 'science';
            break;
        case 'technology':
            Category = 'technology';
            break;
        case 'canada':
            Category = 'canada';
            break;
        case 'china':
            Category = 'china';
            break;
        case 'europe':
            Category = 'europe';
            break;
        case 'news':
            Category = 'news';
            break;
        case 'unitedkingdom':
            Category = 'unitedkingdom';
            break;
        case 'upliftingnews':
            Category = 'upliftingnews';
            break;
        default:
            Category = 'worldnews';
            break;
    }

    return Category;
}
