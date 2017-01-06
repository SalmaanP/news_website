exports.about = function(request, response){


    if(request.session.theme === 'dark')
        response.render('about', {theme: 'dark'});
    else if(request.session.theme == 'light')
        response.render('about', {theme: 'light'});
    else
        response.render('about', {theme: 'light'});
};

exports.index = function(request, response){


    if(request.session.theme === 'dark')
        response.render('index', {theme: 'dark'});
    else if(request.session.theme == 'light')
        response.render('index', {theme: 'light'});
    else
        response.render('index', {theme: 'light'});
};

