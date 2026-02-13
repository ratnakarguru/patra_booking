import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

// import flightsRouter from './routes/flight_route.js';
// import hotelsRouter from './routes/hotel_route.js';
import taxisRouter from './routes/car_route.js';
// import 
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/taxis', taxisRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
