//require express from express
const express = require('express')
//Require cors from cors
const cors = require('cors')
//Require uuid
const { v4: uuidv4 } = require('uuid');
const pool = require('./db')
const app = express()
const port = process.env.PORT || 5000
//use cors with app
app.use(cors())

//User Express
app.use(express.json())

//Get all users from the database
app.get('/users', async (req, res) => {
    try {
        const allUsers = await pool.query('SELECT * FROM users');
        res.status(200).json({ message: 'All users Fetched Successfully', data: allUsers.rows });
    } catch (error) {
        res.json({ error: error.message });
    }
});
//Post a user data to database
app.post('/users', async (req, res) => {
    try {
        //Get users data from the request
        const usersData = req.body;
        //Destructure all value
        const { name, email, password } = usersData
        const id = uuidv4()
        console.log(id, name, email, password);
        const addedUser = await pool.query('INSERT INTO users (id, name, email, password) VALUES($1, $2, $3, $4) RETURNING *', [id, name, email, password]);
        res.status(200).json({ message: `${name} Saved to Database`, data: addedUser.rows });
    } catch (error) {
        res.json({ error: error.message });
    }
});
//Get a specific users from the database
app.get('/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const singleUser = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
        res.status(200).json({ message: 'Single user Fetched Successfully', data: singleUser.rows });
    } catch (error) {
        res.json({ error: error.message });
    }
});

//Delete a specific User from database
app.delete('/deleteuser/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query('DELETE FROM users WHERE id=$1', [id]);
        res.status(200).send({ message: 'One user has been deleted successfully!' });
    } catch (error) {
        res.json({ error: error.message });
    }
});
//Edit/Modify a single user
app.put('/edituser/:id', async (req, res) => {
    try {
        //Get id from params
        const id = req.params.id;
        //Get users data from the request
        const usersData = req.body;
        //Destructure all value
        const { name, password } = usersData
        const updatedUser = await pool.query('UPDATE users SET name=$2, password=$3 WHERE id=$1 RETURNING *', [id, name, password])
        res.status(200).send({ message: `User ${name} updated successfully...`, data: updatedUser.rows })
    } catch (error) {
        res.json({ error: error.message })
    }
})

//Default API
app.get('/', (req, res) => {
    res.send('CoinTab Server is Running...')
})
//Add a app listener
app.listen(port, () => {
    console.log('Server Running on Port: ', port);
})
