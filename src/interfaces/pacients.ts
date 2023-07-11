interface Pacient {
    [key: string]: PacientGeneralInfo | PacientAddress | {} | null
    id: number | string | null,
    generalInfo: PacientGeneralInfo | {},
    address: PacientAddress | {}
}


interface PacientGeneralInfo {
    name: string,
    birthdate: string,
    sex: string
}

interface PacientAddress {
    street: string,
    number: string,
    aditionalInfo: string,
    city: string,
    zipCode: string
}

interface FlatPacient {
    id: number | string,
    name: string,
    birthdate: string,
    sex: string
    street: string,
    number: string,
    aditional_info: string,
    city: string,
    zip_code: string
}


export { Pacient, PacientGeneralInfo, PacientAddress, FlatPacient }