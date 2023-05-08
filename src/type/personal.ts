interface UserForm {
    id?: number,
    username?: string,
    gender: string,
    age: number,
    image?: string | Array<string>,
    email?: string ,
    phone?: string,
    signature: string
}

interface Email{
    userId?: number,
    username?: string,
    email: string,
    code: string,
}

interface Sms{
    userId?: number,
    phone: string,
    code: string,
}

export {
    UserForm,
    Email,
    Sms,
};