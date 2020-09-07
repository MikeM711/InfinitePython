import express, { Application } from 'express';

const app: Application = express();

// Routing
import routes from './routes';
app.use('/api/', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('http://localhost:5000');
});
