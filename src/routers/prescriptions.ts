const express = require('express');
import { Router } from "express";
import {
    getPrescriptions,
    getPrescriptionById,
    createPrescriptions,
    deleteAllPrescriptions,
    deletePrescriptionsById,
    editPrescriptionById
} from "../controllers/prescriptions";

const prescriptionsRouter: Router = express.Router();

prescriptionsRouter
    .get('/', getPrescriptions)
    .get('/:id', getPrescriptionById)
    .post('/', createPrescriptions)
    .patch('/:id', editPrescriptionById)
    .delete('/', deleteAllPrescriptions)
    .delete('/:id', deletePrescriptionsById);

export { prescriptionsRouter };