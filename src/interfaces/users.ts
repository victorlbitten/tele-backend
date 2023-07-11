interface BasicUser {
    [key: string]: number | string | null,
    id: string | number | null,
    userRoleId: string | number | null,
    last_name: string,
    first_name: string,
    email: string,
}


interface User extends BasicUser {
    [key: string]: number | string | null,
    username: string,
    password: string,
}


export { User, BasicUser}
