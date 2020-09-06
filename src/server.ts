import express, { Application } from 'express';

const app: Application = express();

// Routing
import routes from './routes';
app.use('/', routes);

app.listen(3000, () => {
    console.log('http://localhost:3000');
});
