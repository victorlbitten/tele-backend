import { Request, Response, query } from "express";
import { connection } from "../DBConnection";
import { Pacient, PacientAddress, PacientGeneralInfo, FlatPacient} from "../interfaces/pacients";
import { OkPacket, raw } from "mysql2";
import { _getAppointments } from "./appointments";
// TODO: when deleting a pacient, should delete their appointments, prescriptions and clinical conditions


function _buildPacientAggregation(flatPacient: FlatPacient): Pacient {
    return {
        id: flatPacient.id,
        generalInfo: {
            name: flatPacient.name,
            birthdate: flatPacient.birthdate,
            sex: flatPacient.sex
        },
        address: {
            street: flatPacient.street,
            number: flatPacient.number,
            aditionalInfo: flatPacient.aditional_info,
            city: flatPacient.city,
            zipCode: flatPacient.zip_code
        }
    };
}


// GET ALL
async function getPacients (req: Request, res: Response) {
    const queryString = `select * from pacients INNER JOIN pacient_address ON
        pacients.id = pacient_address.pacient_id;`;
    const [query]: any = await connection.execute(queryString);
    
    const pacients = query.map((flatPacient: any) => _buildPacientAggregation(flatPacient));
    if (req.query.basic) {
        res.send(pacients);
        return;
    }

    const pacientIds = query.map((pacient:any) => pacient.id);

    
    const seenDoctors:any = await getSeenDoctors('', pacientIds, true);
    const lastClinicalConditions:any = await getLastClinicalConditions();
    const lastPrescriptions:any = await getLastPrescriptions();
    const pacientsObject = pacientIds.map((pacientId:any) => {
        const currentPacientObject = {
            pacientInfo: {},
            seenDoctors: [],
            lastClinicalConditions: [],
            lastPrescriptions: []
        }
        currentPacientObject.seenDoctors =  seenDoctors.filter((doctor:any) => doctor.pacientId === pacientId);
        currentPacientObject.lastClinicalConditions =  lastClinicalConditions.filter((doctor:any) => doctor.pacientId === pacientId);
        currentPacientObject.lastPrescriptions =  lastPrescriptions.filter((doctor:any) => doctor.pacientId === pacientId);
        currentPacientObject.pacientInfo = pacients.find((pacient:any) => pacient.id === pacientId);
        return currentPacientObject;
    });
    res.send(pacientsObject);
}


// GET BY ID
async function getPacientById (req: Request, res: Response) {
    const pacientId = req.params.id;
    const queryString = `select * from pacients INNER JOIN pacient_address ON
        pacients.id = pacient_address.pacient_id
        WHERE pacients.id = ${pacientId};`;
    const [query]: any = await connection.execute(queryString);

    const pacient = query.map((flatPacient: any) => _buildPacientAggregation(flatPacient));

    const lastClinicalConditions = await getLastClinicalConditions(pacientId);
    const lastPrescriptions = await getLastPrescriptions(pacientId);
    const seenDoctors = await getSeenDoctors(pacientId);
    const appointments = await _getAppointments(pacientId);

    const detailedPacientObject = {
        pacient: pacient[0],
        clinicalConditions: lastClinicalConditions,
        prescriptions: lastPrescriptions,
        doctors: seenDoctors,
        appointments
    }


    res.send(detailedPacientObject);
}




// CREATE
async function createPacient (req: Request, res: Response) {
    const 
        {generalInfo: pacientGeneralInfo, address: pacientAddress}:
        {generalInfo: PacientGeneralInfo, address: PacientAddress} = req.body;
    

    const pacienteGeneralQueryReturn: OkPacket = await _insertPacientGeneralInfo(pacientGeneralInfo);

    await _insertPacientAddress(pacientAddress, pacienteGeneralQueryReturn.insertId);
    
    res.send();
}

async function _insertPacientGeneralInfo (pacientGeneralInfo: PacientGeneralInfo) {
    const queryString = `INSERT INTO pacients
        (name, sex, birthdate) VALUES
        ("${pacientGeneralInfo.name}", "${pacientGeneralInfo.sex}", "${pacientGeneralInfo.birthdate}")`;
    const [pacientGeneralQuery] = await connection.execute(queryString);
    return pacientGeneralQuery as OkPacket;
}

async function _insertPacientAddress (pacientAddress: PacientAddress, pacientId: number | string) {
    const queryString = `INSERT INTO pacient_address
        (pacient_id, street, number, aditional_info, city, zip_code) VALUES
        (
            ${pacientId}, "${pacientAddress.street}", "${pacientAddress.number}",
            "${pacientAddress.aditionalInfo}", "${pacientAddress.city}", "${pacientAddress.zipCode}"
        )`;
    const [pacientAddressQuery] = await connection.execute(queryString);
    return pacientAddressQuery;
}




// DELETE ALL
async function deleteAllPacients (req: Request, res: Response) {
    await _deleteAllPacientsAddresses();
    await _deleteAllPacientsGeneralInfo();
    res.send();
}

async function _deleteAllPacientsAddresses () {
    const queryString = 'DELETE FROM pacient_address';
    const [query] = await connection.execute(queryString);
}

async function _deleteAllPacientsGeneralInfo () {
    const queryString = 'DELETE FROM pacients';
    const [query] = await connection.execute(queryString);
}




// DELETE BY ID
async function deletePacientById (req: Request, res: Response) {
    const pacientId = req.params.id;
    _deletePacientAddressesByPacientId(pacientId);
    _deletePacientGeneralInfoByPacientId(pacientId);
    res.send();
}

async function _deletePacientAddressesByPacientId (pacientId: number | string) {
    const queryString = `DELETE FROM pacient_address WHERE pacient_address.pacient_id = "${pacientId}"`;
    const [query] = await connection.execute(queryString);
}

async function _deletePacientGeneralInfoByPacientId (pacientId: number | string) {
    const queryString = `DELETE FROM pacients where pacients.id = "${pacientId}"`;
    const [query] = await connection.execute(queryString);
}




async function buildAppointmentObjectWithPacientData (appointments: any) {
    const pacientsIds = appointments.map(({pacient}: {pacient: any}) => pacient.id);

    const allPacientsQueryString = `SELECT * FROM pacients
        INNER JOIN pacient_address ON pacients.id = pacient_address.pacient_id
        WHERE pacients.id IN (${[...pacientsIds]})`;
    const [allPacients]: any = await connection.execute(allPacientsQueryString);

    return appointments.map((appointment: any) => {
        const flatPacient = allPacients.find(({id}: {id:any}) => appointment.pacient.id === id);
        const pacientAggregation = _buildPacientAggregation(flatPacient);
        appointment.pacient = pacientAggregation;
        return appointment;
    });
}


async function getSeenDoctors (pacientId?: string | number, pacientIds?: any, multiple?: boolean) {
    let queryString = `SELECT DISTINCT
        pacients.id as 'pacient_id', users.first_name, users.last_name, users.specialization, users.crm
        FROM pacients INNER JOIN appointments ON appointments.pacient_id = pacients.id
        INNER JOIN users ON appointments.user_id = users.id `;

    const whereClause = multiple
    ? `WHERE pacients.id in (${[...pacientIds]})`
    : `WHERE pacients.id = ${pacientId}`;

    queryString += whereClause;
    
    
    const [query]:any = await connection.execute(queryString);
    return query.map((rawData:any) => ({
            pacientId: rawData.pacient_id,
            firstName: rawData.first_name,
            lastName: rawData.last_name,
            specialization: rawData.specialization,
            crm: rawData.crm
    }));
}


async function getLastClinicalConditions (pacient_id?: number | string) {
    let queryString = `
    select * from appointments 
    INNER JOIN (select pacient_id, max(end_date) as max_end_date from appointments where done = 1 group by pacient_id) msd
    on appointments.pacient_id = msd.pacient_id and appointments.end_date = max_end_date
    INNER JOIN clinical_conditions ON clinical_conditions.appointment_id = appointments.id`;

    queryString += pacient_id
        ? ` WHERE appointments.pacient_id=${pacient_id};`
        : `;`

    const [query]:any = await connection.execute(queryString);
    return query.map((entry:any) => ({
        id: entry.id,
        pacientId: entry.pacient_id,
        userId: entry.user_id,
        appointmentId: entry.appointment_id,
        clinicalConditionStatusId: entry.clinical_condition_status_id,
        name: entry.name,
        description: entry.description

    }));
}


async function getLastPrescriptions (pacient_id?: number | string) {
    let queryString = `
    select * from appointments 
    INNER JOIN (select pacient_id, max(end_date) as max_end_date from appointments where done = 1 group by pacient_id) msd
    on appointments.pacient_id = msd.pacient_id and appointments.end_date = max_end_date
    INNER JOIN prescriptions ON prescriptions.appointment_id = appointments.id`;

    queryString += pacient_id
        ? ` WHERE appointments.pacient_id=${pacient_id};`
        : `;`

    const [query]:any = await connection.execute(queryString);
    return query.map((entry:any) => ({
        id: entry.id,
        pacientId: entry.pacient_id,
        appointmentId: entry.appointment_id,
        useInstructions: entry.use_instructions,
        dosage: entry.dosage,
        timesADay: entry.times_a_day,
        medicationName: entry.medicationName

    }));
}



export {
    getPacients,
    getPacientById,
    createPacient,
    deleteAllPacients,
    deletePacientById,

    buildAppointmentObjectWithPacientData
}


