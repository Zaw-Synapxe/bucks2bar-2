const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const PROJECT_NAME = process.env.PROJECT_NAME || 'Bucks2Bar-II';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: `${PROJECT_NAME} server is running!`,
        timestamp: new Date().toISOString()
    });
});

// API endpoint for drink calculations (example)
app.post('/api/calculate', (req, res) => {
    try {
        const { amount, drinkPrice } = req.body;
        
        if (!amount || !drinkPrice) {
            return res.status(400).json({
                error: 'Both amount and drinkPrice are required'
            });
        }

        const drinks = Math.floor(amount / drinkPrice);
        const remaining = (amount % drinkPrice).toFixed(2);

        res.json({
            amount: parseFloat(amount),
            drinkPrice: parseFloat(drinkPrice),
            drinks: drinks,
            remaining: parseFloat(remaining),
            message: `You can afford ${drinks} drinks with $${remaining} left over!`
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error occurred',
            message: error.message
        });
    }
});

// Serve the main HTML file for any non-API routes (avoid this route for now)
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🍺 ${PROJECT_NAME} server is running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${__dirname}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
