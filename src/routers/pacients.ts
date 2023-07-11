const express = require('express');
import { Router } from "express";
import {
    getPacients,
    getPacientById,
    createPacient,
    deleteAllPacients,
    deletePacientById
} from "../controllers/pacients";

const pacientsRouter: Router = express.Router();

pacientsRouter
    .get('/', getPacients)
    .get('/:id', getPacientById)
    .post('/', createPacient)
    .delete('/', deleteAllPacients)
    .delete('/:id', deletePacientById);

export { pacientsRouter };

















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