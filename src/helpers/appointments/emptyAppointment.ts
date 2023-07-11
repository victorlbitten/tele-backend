import { Appointment, AppointmentRawData } from "../../interfaces/appointment";
import { emptyPacientObject } from "../pacients/emptyPacient";
import { emptyUserObject } from "../users/emptyUser";

export function emptyAppointment(): Appointment {
    return {
        appointmentId: null,
        startDate: null,
        endDate: null,
        prescriptions: [],
        clinicalConditions: [],
        pacient: emptyPacientObject(),
        doctor: emptyUserObject(),
    }
}




export function initializeEmptyAppointmentObjectFromRawData (rawData: AppointmentRawData) {
    const appointmentDataObject: any = {};
    appointmentDataObject[rawData.appointment_id] = emptyAppointment;
    appointmentDataObject[rawData.appointment_id]["appointmentId"] = rawData.appointment_id;
    appointmentDataObject[rawData.appointment_id]["startDate"] = rawData.start_date;
    appointmentDataObject[rawData.appointment_id]["endDate"] = rawData.end_date;

    return appointmentDataObject;
}