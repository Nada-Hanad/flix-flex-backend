const express = require("express");
const UserController = require("../controllers/UserController");
const { authenticateToken } = require("../middlewares/auth");

const usersRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User related endpoints
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       409:
 *         description: Username already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
usersRouter.post("/register", UserController.registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
usersRouter.post("/login", UserController.loginUser);

/**
 * @swagger
 * /users/favorites/add:
 *   post:
 *     summary: Add media to favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *               seriesId:
 *                 type: string
 *             required:
 *               - movieId
 *               - seriesId
 *     responses:
 *       200:
 *         description: Added to favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to add to favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
usersRouter.post(
  "/favorites/add",
  authenticateToken,
  UserController.addToFavorites
);

/**
 * @swagger
 * /users/favorites/remove:
 *   post:
 *     summary: Remove media from favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *               seriesId:
 *                 type: string
 *             required:
 *               - movieId
 *               - seriesId
 *     responses:
 *       200:
 *         description: Removed from favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to remove from favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
usersRouter.post(
  "/favorites/remove",
  authenticateToken,
  UserController.removeFromFavorites
);

/**
 * @swagger
 * /users/favorites:
 *   post:
 *     summary: Get user's favorite media
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's favorite media retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 favoriteMoviesIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                 favoriteSeriesIds:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Failed to get favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
usersRouter.post("/favorites", authenticateToken, UserController.getFavorites);

module.exports = usersRouter;
