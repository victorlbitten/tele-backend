import { Request, Response } from "express";
import { connection, databaseName } from "../DBConnection";


async function getUsers (req: Request, res: Response) {
    const [query]:any = await connection.execute(`SELECT * FROM users`);
    const userToReturn = query.map((entry:any) => {
        return {
            id: entry.id,
            username: entry.username,
            email:entry.email,
            firstName: entry.first_name,
            lastName: entry.last_name,
            userRoleId: entry.user_role_id,
            specialization: entry.specialization,
            crm: entry.crm
        };
    })
    res.send(userToReturn);
}

async function getUserById (req: Request, res: Response) {
    const userId = req.params.id;
    const queryString = `SELECT * FROM users WHERE
        users.id = ${userId};`
    const [query] = await connection.execute(queryString);
    res.send(query);
}


async function createUser (req: Request, res: Response) {
    const user = req.body;
    const email = 'email@email.com';
    const roleId = 2;
    const queryString = `INSERT INTO users
        (username, email, first_name, last_name, password, user_role_id, specialization, crm) VALUES
        (
            "${user.username}", "${email}", "${user.firstName}", "${user.lastName}",
            "${user.password}", ${roleId}, "${user.specialization}", "${user.crm}"
        )`;
    const [query] = await connection.execute(queryString);
    res.send(query);
}


async function deleteAllUsers (req: Request, res: Response) {
    const queryString = `DELETE FROM users`;
    const [query] = await connection.execute(queryString);
    res.send(query);
}


async function deleteUserById (req: Request, res: Response) {
    const userId = req.params.id;
    const queryString = `DELETE FROM users WHERE users.id = ${userId}`;
    const [query] = await connection.execute(queryString);
    res.send(query);
}




async function buildAppointmentObjectWithDoctorData (appointments: any) {
    const doctorsIds = appointments.map(({doctor}: {doctor: any}) => doctor.id);

    const allDoctorsQueryString = `SELECT * FROM users WHERE users.id IN (${[...doctorsIds]});`
    const [allDoctors]: any = await connection.execute(allDoctorsQueryString);

    return appointments.map((appointment: any) => {
        const appointmentDoctor = allDoctors
            .find(({id}: {id:any}) => appointment.doctor.id === id)
        appointment.doctor = {
            id: appointmentDoctor.id,
            username: appointmentDoctor.username,
            email: appointmentDoctor.email,
            firstName: appointmentDoctor.first_name,
            lastName: appointmentDoctor.last_name,
            specialization: appointmentDoctor.specialization,
            crm: appointmentDoctor.crm
        };
        return appointment;
    });

}



export {
    getUsers,
    getUserById,
    createUser,
    deleteAllUsers,
    deleteUserById,

    buildAppointmentObjectWithDoctorData
}