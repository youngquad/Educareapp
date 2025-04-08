javascript
CopyEdit
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));  // Logs HTTP requests
app.use(cors({
    origin: ['https://example.com', 'https://educare-app.com'],
    methods: 'GET,POST',
    credentials: true
}));

// Database connection (MongoDB)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Models
const User = mongoose.model('User', require('./models/User'));

// Authentication Middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send("No token provided");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).send("Failed to authenticate token");
        req.userId = decoded.id;
        next();
    });
};

// Routes
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).send("User registered successfully");
    } catch (error) {
        res.status(400).send("Error registering user");
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
        return res.status(401).send("Invalid credentials");
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// API for educational content (protected route)
app.get('/content', authMiddleware, (req, res) => {
    res.json({ content: "Welcome to Educare Content" });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
models/User.js:
javascript
CopyEdit
const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
.env:
env
CopyEdit
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

2. Frontend (React Native - Mobile)
* Folder Structure:
    * educare-mobile/
        * App.js
        * package.json
App.js:
javascript
CopyEdit
import React, { useState, useContext, createContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Create Context for Auth
const AuthContext = createContext();

const HomeScreen = ({ navigation }) => {
    const { login } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Educare</Text>
            <Button title="Get Started" onPress={() => navigation.navigate('Dashboard')} />
            <Button title="Login" onPress={() => login("user_token")} />
        </View>
    );
};

const DashboardScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Dashboard</Text>
        </View>
    );
};

// Create Stack Navigator
const Stack = createStackNavigator();

const App = () => {
    const [authToken, setAuthToken] = useState(null);

    const login = (token) => setAuthToken(token);
    const logout = () => setAuthToken(null);

    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Dashboard" component={DashboardScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthContext.Provider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 }
});

export default App;
package.json:
json
CopyEdit
{
  "name": "educare-mobile",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@react-navigation/native": "^6.0.2",
    "@react-navigation/stack": "^6.0.9",
    "react": "18.0.0",
    "react-native": "0.70.5",
    "react-native-safe-area-context": "^4.2.4",
    "react-native-screens": "^3.10.0"
  },
  "devDependencies": {
    "@babel/core": "^7.17.9"
  }
}
