import { Request, Response } from "express"
import { connection } from "../DBConnection";
import { Prescription } from "../interfaces/prescriptions";
import { whereClauseByForeignKeyName } from "../helpers/prescriptions/prescriptionsWhereClause";
import { emptyAppointment } from "../helpers/appointments/emptyAppointment";
import { Appointment } from "../interfaces/appointment";

// GET ALL
async function getPrescriptions (req: Request, res: Response) {
    const queryString = `SELECT * FROM prescriptions;`;
    const [prescriptions] = await connection.execute(queryString);
    res.send(prescriptions);
}



// GET BY ID
async function getPrescriptionById (req: Request, res: Response) {
    const prescriptionId = req.params.id;
    const queryString = `SELECT * FROM prescriptions WHERE prescriptions.id = ${prescriptionId};`;
    const [prescription] = await connection.execute(queryString);
    res.send(prescription);
}




// CREATE
async function createPrescriptions (req: Request, res: Response) {
    const prescriptions = await _insertPrescriptions(req.body.prescriptions);
    res.send(prescriptions);
}


async function _insertPrescriptions (prescriptions: Array<Prescription>) {
    let queryStringBase = `INSERT INTO prescriptions
    (pacient_id, user_id, appointment_id, use_instructions, dosage, times_a_day, medication_name) VALUES `;

    const valuesStrings = prescriptions.map((prescription: any) => {
        return `("${prescription.pacientId}", "${prescription.userId}", "${prescription.appointmentId}", "${prescription.useInstructions}", "${prescription.dosage}", "${prescription.timesADay}", "${prescription.medicationName}")`;
    });

    const valuesStringCommaSeparated = valuesStrings.join();
    const queryString = [queryStringBase, valuesStringCommaSeparated].join(' ');

    const [query] = await connection.execute(queryString);
    return query;
}


async function editPrescriptionById (req: Request, res: Response) {
    const prescriptionId = req.params.id;
    const prescription = req.body.prescription;

    const queryString = `UPDATE prescriptions SET
        prescriptions.use_instructions="${prescription.useInstructions}",
        prescriptions.dosage="${prescription.dosage}",
        prescriptions.times_a_day='${prescription.timesADay}',
        prescriptions.medication_name="${prescription.medicationName}"
        WHERE prescriptions.id = '${prescriptionId}'`;

    const [query] = await connection.execute(queryString);
    res.send(query);


}





// DELETE ALL
async function deleteAllPrescriptions (req: Request, res: Response) {
    const queryString = `DELETE FROM prescriptions;`;

    const query = await connection.execute(queryString);
    res.send(query);
}


// DELETE BY ID
async function deletePrescriptionsById (req: Request, res: Response) {
    const prescriptionId = req.params.id;
    const queryString = `DELETE FROM prescriptions WHERE prescriptions.id = ${prescriptionId}`

    const [result] = await connection.execute(queryString);
    res.send(result);
}








// ACTIONS BY FOREIGN KEY
// GET BY FOREIGN KEYS
// USER ID
async function getAllDoctorPrescriptions (doctorId: string | number) {
    const definingEntityName = 'userId';
    const prescriptions = await _prescriptionsActionByForeignKey('select', definingEntityName, doctorId);
    return prescriptions;
}
// PACIENT ID
async function getAllPacientPrescriptions (pacientId: string | number) {
    const definingEntityName = 'pacientId';
    const prescriptions = await _prescriptionsActionByForeignKey('select', definingEntityName, pacientId);
    return prescriptions;
}
// APPOINTMENT ID
async function getAllAppointmentPrescriptions (appointmentId: string | number) {
    const definingEntityName = 'appointmentId';
    const prescriptions = await _prescriptionsActionByForeignKey('select', definingEntityName, appointmentId);
    return prescriptions;
}




// DELETE BY FOREIGN KEYS
// USER ID
async function deleteDoctorPrescriptions (doctorId: string | number) {
    const definingEntityName = 'userId';
    const prescriptions = await _prescriptionsActionByForeignKey('delete', definingEntityName, doctorId);
    return prescriptions;
}
// PACIENT ID
async function deletePacientPrescriptions (pacientId: string | number) {
    const definingEntityName = 'pacientId';
    const prescriptions = await _prescriptionsActionByForeignKey('delete', definingEntityName, pacientId);
    return prescriptions;
}
// APPOINTMENT ID
async function deleteAppointmentPrescriptions (appointmentId: string | number) {
    const definingEntityName = 'appointmentId';
    const prescriptions = await _prescriptionsActionByForeignKey('delete', definingEntityName, appointmentId);
    return prescriptions;
}

// ACTION FUNCTION
async function _prescriptionsActionByForeignKey (actionName: string, foreignKeyName: string, foreignKeyId: string | number) {
    const clauseByActionName: any = {
        delete: () => `DELETE FROM prescriptions WHERE `,
        select: () => `SELECT * FROM prescriptions WHERE `
    };
    const queryStringBase = clauseByActionName[actionName]();
    const queryString = [queryStringBase, whereClauseByForeignKeyName[foreignKeyName](foreignKeyId)].join(' ');

    const [result] = await connection.execute(queryString);
    return result;
}


async function buildAppointmentObjectWithPrescriptions (appointments: any) {
    try {
        const appointmentsIds = appointments.map(({id}: {id: any}) => id);
        const allPrescriptionsQueryString = `SELECT * FROM prescriptions WHERE prescriptions.appointment_id IN (${[...appointmentsIds]});`
        const [allPrescriptions]: any = await connection.execute(allPrescriptionsQueryString);
    
        return appointments.map((appointment: any) => {
            const appointmentObject: Appointment = emptyAppointment();
            appointmentObject.appointmentId = appointment.id;
            appointmentObject.startDate = appointment.start_date;
            appointmentObject.endDate = appointment.end_date;
            appointmentObject.done = appointment.done;
            appointmentObject.pacient.id = appointment.pacient_id;
            appointmentObject.doctor.id = appointment.user_id;
            appointmentObject.prescriptions = allPrescriptions
                .filter((prescription: any) => prescription['appointment_id'] === appointment.id)
                .map((prescription: any) => ({
                    id: prescription.id,
                    userId: prescription.user_id,
                    pacientId: prescription.pacient_id,
                    appointmentId: prescription.appointment_id,
                    useInstructions: prescription.use_instructions,
                    dosage: prescription.dosage,
                    timesADay: prescription.times_a_day,
                    medicationName: prescription.medication_name,
                }));
            return appointmentObject;
        });
    } catch (error) {
        console.log("Error retrieving prescriptions on appointment build");
        throw new Error("Appointment build - error retrieving prescriptions");
        
    }
}




export {
    getPrescriptions,
    getPrescriptionById,
    createPrescriptions,
    deleteAllPrescriptions,
    deletePrescriptionsById,
    editPrescriptionById,

    deleteAppointmentPrescriptions,
    getAllAppointmentPrescriptions,

    buildAppointmentObjectWithPrescriptions
}