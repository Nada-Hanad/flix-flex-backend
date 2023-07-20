const express = require("express");

const usersRouter = require("./UsersRouter");

const router = express();

router.use("/users", usersRouter);

module.exports = router;
