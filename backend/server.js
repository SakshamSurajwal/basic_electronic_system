const express=require('express');
const dotenv=require('dotenv');
const connectDB=require('./config/db.js');
const userRoute=require('./routes/userRoute');
const candidateRoute=require('./routes/candidateRoute');

dotenv.config({path:`./c.env`});
connectDB();
const app=express();
app.use(express.json());

let storedValue = "";

app.get('/api/value', (req, res) => {
    res.json({ value: storedValue });
});

app.post('/api/value', (req, res) => {
    const { value } = req.body;
    storedValue = value;
    res.json({ message: 'Value updated successfully!',value: storedValue });
});

app.use('/api/user',userRoute);
app.use('/api/candidate',candidateRoute);

const PORT=process.env.PORT||8000;

const server=app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});
