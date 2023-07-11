import { Pacient } from "../../interfaces/pacients";

export function emptyPacientObject () {
    const emptyPacient: Pacient = {
        id: null,
        generalInfo: {},
        address: {}
    }
    return emptyPacient;
}