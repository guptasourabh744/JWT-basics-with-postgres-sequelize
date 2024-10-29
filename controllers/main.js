const { User } = require('../models/User');
const CustomAPIError = require('../errors/custom-error');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.create({ username, password });
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({ msg: 'User registered successfully', token });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ msg: 'Registration failed', error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      throw new CustomAPIError('Please provide username and password', 400);
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new CustomAPIError('Invalid username or password', 401);
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new CustomAPIError('Invalid username or password', 401);
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(200).json({ msg: 'Genuine user hai bro', token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ msg: 'Login failed' });
  }
};

const dashboard = async (req, res) => {
  try {
    const luckyNumber = Math.floor(Math.random() * 100);
    res.status(200).json({
      msg: `Hello, ${req.user.username} bhai`,
      secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
    });
  } catch (error) {
    console.error("Error in dashboard:", error);
    res.status(500).json({ msg: 'An error occurred fetching the dashboard' });
  }
};

module.exports = {
  register,
  login,
  dashboard,
};
