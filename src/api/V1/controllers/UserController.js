const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const UserController = {
  async registerUser(req, res) {
    try {
      const { username, password } = req.body;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

      res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  },

  async loginUser(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

      res.status(200).json({ token });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ error: "Failed to log in user" });
    }
  },

  async addToFavorites(req, res) {
    try {
      const userId = req.user.userId;
      const { movieId, seriesId } = req.body;

      const user = await User.findById(userId);

      if (movieId && !user.favoriteMovies.includes(movieId)) {
        user.favoriteMovies.push(movieId);
      }

      if (seriesId && !user.favoriteSeries.includes(seriesId)) {
        user.favoriteSeries.push(seriesId);
      }

      await user.save();

      res.status(200).json({ message: "Added to favorites successfully" });
    } catch (error) {
      console.error("Error adding to favorites:", error);
      res.status(500).json({ error: "Failed to add to favorites" });
    }
  },

  async removeFromFavorites(req, res) {
    try {
      const userId = req.user.userId;
      const { movieId, seriesId } = req.body;

      const user = await User.findById(userId);

      if (movieId && user.favoriteMovies.includes(movieId)) {
        user.favoriteMovies = user.favoriteMovies.filter(
          (id) => id !== movieId
        );
      }

      if (seriesId && user.favoriteSeries.includes(seriesId)) {
        user.favoriteSeries = user.favoriteSeries.filter(
          (id) => id !== seriesId
        );
      }

      await user.save();

      res.status(200).json({ message: "Removed from favorites successfully" });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      res.status(500).json({ error: "Failed to remove from favorites" });
    }
  },

  async getFavorites(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const favoriteMoviesIds = user.favoriteMovies;
      const favoriteSeriesIds = user.favoriteSeries;

      res.status(200).json({ favoriteMoviesIds, favoriteSeriesIds });
    } catch (error) {
      console.error("Error getting favorites:", error);
      res.status(500).json({ error: "Failed to get favorites" });
    }
  },
};

module.exports = UserController;
