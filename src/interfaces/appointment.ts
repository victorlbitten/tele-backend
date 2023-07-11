import { ClinicalCondition } from "./clinicalConditions";
import { Pacient } from "./pacients";
import { Prescription } from "./prescriptions";
import { BasicUser } from "./users";

interface Appointment {
    [key: string]: string | null | Array<Prescription> | Pacient | BasicUser | {},
    appointmentId: string | null,
    startDate: string | null,
    endDate: string | null,
    done: boolean | string | number,
    prescriptions: Array<Prescription> | [],
    pacient: Pacient,
    doctor: BasicUser,
    clinicalConditions: ClinicalCondition | []
}

interface AppointmentRawData {
    [key: string]: string | number | boolean
    id: string | number,
    pacient_id: string | number,
    user_id: string | number,
    appointment_id: string | number,
    start_date: string
    end_date: string
    use_instructions: string
    dosage: string
    times_a_day: string | number,
    medication_name: string
    done: boolean | string | number
}






export { Appointment, AppointmentRawData};