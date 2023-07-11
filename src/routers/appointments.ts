const express = require('express');
import { Router } from "express";
import {
    getAppointments,
    getAppointmentById,
    createAppointment,
    deleteAllAppointments,
    deleteAppointmentById
} from "../controllers/appointments";

const appointmentsRouter: Router = express.Router();

appointmentsRouter
    .get('/', getAppointments)
    .get('/:id', getAppointmentById)
    .post('/', createAppointment)
    .delete('/', deleteAllAppointments)
    .delete('/:id', deleteAppointmentById);

export { appointmentsRouter };