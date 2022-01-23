import express from 'express';
import fetch from 'node-fetch';
import { engine } from 'express-handlebars';
import { marked } from 'marked';

const app = express();

app.engine('handlebars', engine({
    helpers: {
        markdown: input => marked(input)
    }
}));

app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (request, response) => {
    fetch('https://lernia-kino-cms.herokuapp.com/api/movies').then(apiResponse => {
        if (apiResponse.ok)
            apiResponse.json().then(data => {
                response.render('home', data);
            });
    });
});

app.get('/movies/:id', (request, response) => {
    fetch('https://lernia-kino-cms.herokuapp.com/api/movies/' + request.params.id).then(apiResponse => {
        if (apiResponse.ok)
            apiResponse.json().then(data => {
                response.render('movie', data);
            });
        else {
            response.statusCode = 404;
            response.render('404');
        }
    });
});

app.use("/src", express.static("./src"));

app.listen(5080);

export default app;