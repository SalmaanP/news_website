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
        default:
            Category = 'worldnews';
            break;
    }

    return Category;
}
