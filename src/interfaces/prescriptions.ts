interface Prescription {
    id?: string | number,
    userId: string | number,
    pacientId: string | number,
    appointmentId: string | number | null | undefined,
    useInstructions: string,
    dosage: string,
    timesADay: string | number,
    medicationName: string | number
}


// Prescription object that comes from the front end
// 'delete' is just an array of prescription IDs
interface FEPrescription {
    create: Array<Prescription>,
    edit: Array<Prescription>,
    delete: [number | string]
}



export { Prescription, FEPrescription }