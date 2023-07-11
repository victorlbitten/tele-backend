import { Request, Response } from "express"
import { connection, databaseName } from "../DBConnection";
import { buildAppointmentObjectWithPrescriptions, deleteAppointmentPrescriptions, getAllAppointmentPrescriptions } from "./prescriptions";
import { buildAppointmentObjectWithClinicalConditions } from "./clinicalConditions";
import { buildAppointmentObjectWithPacientData } from "./pacients";
import { buildAppointmentObjectWithDoctorData } from "./users";



// GET ALL
async function getAppointments(req: Request, res: Response) {
    try {
        const fetchOnlyNextAppointments = req.query.next;


        // if (!allAppointments.length){
        //     res.send([])
        //     return;
        // };

        const allAppointments = await _getAppointments(null, null, fetchOnlyNextAppointments);

        res.send(allAppointments);
    } catch (error) {
        console.log(error);
        throw new Error("Error getting appointments");

    }
}

async function _getAppointments(
    pacientId: string | number | null = null,
    appointmentId: string | number | null = null,
    onlyNext: any = false
) {
    let allAppointmentsQueryString = `SELECT * FROM appointments`;
    if (pacientId) {
        allAppointmentsQueryString += ` WHERE appointments.pacient_id = ${pacientId};`;
    }
    if (onlyNext) {
        allAppointmentsQueryString += " WHERE start_date > now();"
    }
    if (appointmentId) {
        allAppointmentsQueryString += ` WHERE appointments.id = ${appointmentId};`;
    }
    const [allAppointments]: any = await connection.execute(allAppointmentsQueryString);
    const appointmentsWithPrescriptions = await buildAppointmentObjectWithPrescriptions(allAppointments);
    const appointmentsWithClinicalConditions = await buildAppointmentObjectWithClinicalConditions(appointmentsWithPrescriptions);
    const appointmentsWithPacients = await buildAppointmentObjectWithPacientData(appointmentsWithClinicalConditions);
    const appointmentsWithDoctor = await buildAppointmentObjectWithDoctorData(appointmentsWithPacients);

    return appointmentsWithDoctor;
}


// GET BY ID
async function getAppointmentById(req: Request, res: Response) {
    const appointmentId = req.params.id;

    const appointments = await _getAppointments(null, appointmentId);
    res.send(appointments[0]);
}



// CREATE
async function createAppointment(req: Request, res: Response) {
    const {
        pacientId,
        userId,
        startDate,
        endDate } = req.body

    const queryString = `INSERT INTO appointments (pacient_id, user_id, start_date, end_date) VALUES
        ("${pacientId}", "${userId}", "${startDate}", "${endDate}");`;
    const [query] = await connection.execute(queryString);
    res.send(query);
}



// DELETE ALL

async function deleteAllAppointments(req: Request, res: Response) {
    const queryString = `DELETE FROM appointments;`;
    const [query] = await connection.execute(queryString);

    res.send(query);
}



// DELETE BY ID
async function deleteAppointmentById(req: Request, res: Response) {
    const appointmentId = req.params.id;

    const deletedPrescriptions = await deleteAppointmentPrescriptions(appointmentId);
    const deletedAppointment = await _deleteAppointmentsById(appointmentId);

    res.send({
        deletedPrescriptions,
        deletedAppointment
    });

}

async function _deleteAppointmentsById(appointmentId: string | number) {
    const queryString = `DELETE FROM appointments WHERE appointments.id = ${appointmentId}`;

    const [result] = await connection.execute(queryString);
    return result;
}



export {
    getAppointments,
    getAppointmentById,
    createAppointment,
    deleteAllAppointments,
    deleteAppointmentById,

    _getAppointments
}