import express from 'express';

const app = express();

app.get('/test', (req, res) => {
    res.json({ message: 'working' });
});

app.listen(5000, () => {
    console.log('Minimal server running on port 5000');
});