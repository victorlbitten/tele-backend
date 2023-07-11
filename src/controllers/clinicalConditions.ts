import { Request, Response } from "express"
import { connection } from "../DBConnection";
import { Appointment } from "../interfaces/appointment";


// GET ALL
async function getClinicalConditions (req: Request, res: Response) {
    const queryString = `SELECT * FROM clinical_conditions;`;

    const [query] = await connection.execute(queryString);
    res.send(query);
}


// GET BY ID
async function getClinicalConditionsById () {}


// CREATE
async function createClinicalConditions (req: Request, res: Response) {
    const data = req.body.condition;
    const defaultClinicalConditionStatus = 1;
    const clinicalConditionStatus = data.clinicalConditionStatusId || defaultClinicalConditionStatus;
    const appointmentId = data.appointmentId;
    

    const queryString = `INSERT INTO clinical_conditions
        (pacient_id, user_id, appointment_id, name, description, clinical_condition_status_id) VALUES
        ("${data.pacientId}","${data.userId}", ${appointmentId},"${data.name}",
        "${data.description}","${clinicalConditionStatus}");`;
    
    const [query] = await connection.execute(queryString);
    res.send(query);
}


async function editClinicalConditionById (req: Request, res: Response){
    const conditionId = req.params.id;
    const condition = req.body.condition;
    const queryString = `UPDATE clinical_conditions SET
    clinical_conditions.name="${condition.name}",
    clinical_conditions.description="${condition.description}",
    clinical_conditions.clinical_condition_status_id='${condition.clinicalConditionStatusId}'
    WHERE clinical_conditions.id = '${conditionId}'`;

    const [query] = await connection.execute(queryString);
    res.send(query);
}






// DELETE ALL
async function deleteAllClinicalConditions (req: Request, res: Response) {
    const queryString = `DELETE FROM clinical_conditions;`;

    const [query] = await connection.execute(queryString);
    res.send(query);
}


// DELETE BY ID
async function deleteClinicalConditionsById (req: Request, res: Response) {
    const conditionId = req.params.id;
    const queryString = `DELETE FROM clinical_conditions WHERE clinical_conditions.id = ${conditionId}`

    const [result] = await connection.execute(queryString);
    res.send(result);
}






async function buildAppointmentObjectWithClinicalConditions (appointments: any) {
    const appointmentsIds = appointments.map(({appointmentId}: {appointmentId: any}) => appointmentId);

    const allClinicalConditionsQueryString = `SELECT * FROM clinical_conditions WHERE clinical_conditions.appointment_id IN (${[...appointmentsIds]});`
    const [allClinicalConditions]: any = await connection.execute(allClinicalConditionsQueryString);

    return appointments.map((appointment: any) => {
        appointment.clinicalConditions = allClinicalConditions
            .filter((clinicalCondition: any) => clinicalCondition['appointment_id'] === appointment.appointmentId)
            .map((clinicalCondition: any) => ({
                id: clinicalCondition.id,
                userId: clinicalCondition.user_id,
                appointmentId: clinicalCondition.appointment_id,
                name: clinicalCondition.name,
                description: clinicalCondition.description,
                clinicalConditionStatusId: clinicalCondition.clinical_condition_status_id
            }));
        return appointment;
    });
}

export {
    getClinicalConditions,
    getClinicalConditionsById,
    createClinicalConditions,
    deleteAllClinicalConditions,
    deleteClinicalConditionsById,
    editClinicalConditionById,

    buildAppointmentObjectWithClinicalConditions
}