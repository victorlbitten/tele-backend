interface WhereClauseByForeignKeyName {
    [key: string]: (a: string | number) => string,
    pacientId: (a: string | number) => string,
    userId: (a: string | number) => string,
    appointmentId: (a: string | number) => string
}

export const whereClauseByForeignKeyName: WhereClauseByForeignKeyName = {
    "pacientId": (foreignKeyId: string | number) => `prescriptions.pacient_id = ${foreignKeyId}`,
    "userId": (foreignKeyId: string | number) => `prescriptions.user_id = ${foreignKeyId}`,
    "appointmentId": (foreignKeyId: string | number) => `prescriptions.appointment_id = ${foreignKeyId}`
};

