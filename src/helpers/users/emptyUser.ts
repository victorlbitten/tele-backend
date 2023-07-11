import { BasicUser } from "../../interfaces/users"

export function emptyUserObject () {
    const emptyUser: BasicUser = {
        id: null,
        userRoleId: null,
        last_name: '',
        first_name: '',
        email: '',
    }
    return emptyUser
}