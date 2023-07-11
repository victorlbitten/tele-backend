const express = require('express');
import { Router } from "express";
import {
    getClinicalConditions,
    getClinicalConditionsById,
    createClinicalConditions,
    deleteAllClinicalConditions,
    deleteClinicalConditionsById,
    editClinicalConditionById
} from "../controllers/clinicalConditions";

const clinicalConditionsRouter: Router = express.Router();

clinicalConditionsRouter
    .get('/', getClinicalConditions)
    .get('/:id', getClinicalConditionsById)
    .patch('/:id', editClinicalConditionById)
    .post('/', createClinicalConditions)
    .delete('/', deleteAllClinicalConditions)
    .delete('/:id', deleteClinicalConditionsById);

export { clinicalConditionsRouter };