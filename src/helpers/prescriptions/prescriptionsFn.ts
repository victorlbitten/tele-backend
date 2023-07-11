export function prescriptionFromAppointmentEntry (appointment: any) {
    return {
        id: appointment.id,
        userId: appointment.user_id,
        appointmentId: appointment.appointment_id,
        useInstructions: appointment.use_instructions,
        dosage: appointment.dosage,
        timesADay: appointment.times_a_day,
        medicationName: appointment.medication_name
    };
}