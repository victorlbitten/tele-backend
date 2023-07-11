const express = require('express');
import { Router } from "express";
import {
    getUsers,
    getUserById,
    createUser,
    deleteAllUsers,
    deleteUserById
} from "../controllers/users";

const usersRouter: Router = express.Router();

usersRouter
    .get('/', getUsers)
    .get('/:id', getUserById)
    .post('/', createUser)
    .delete('/', deleteAllUsers)
    .delete('/:id', deleteUserById);

export { usersRouter };

















/*
CREATE
    POST /tasks

READ
    GET /tasks
    GET /tasks/:id

UPDATE
    PATCH /tasks/:id

DELETE
    DELETE /tasks/:id
*/