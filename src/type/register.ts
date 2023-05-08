interface RegisterForm {
    username: string,
    password: string,
    confirmPwd: string
}

interface UserInfoForm {
    username: string,
    password: string,
    gender?: string,
    age?: number,
    email?: string ,
    phone?: string,
    signature?: string
}


export {
    RegisterForm,
    UserInfoForm
}