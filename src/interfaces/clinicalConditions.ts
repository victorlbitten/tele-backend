interface ClinicalCondition {
    id: string | number,
    pacient_id: string | number,
    user_id: string | number,
    appointment_id: string | number | null,
    clinical_condition_status_id: string | number,
    name: string,
    description: string,
}

export { ClinicalCondition }