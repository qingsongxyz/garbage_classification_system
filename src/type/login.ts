interface UserLoginForm {
    username: string,
    password: string,
}

interface PhoneLoginForm{
    phone: string,
    captcha: string
}

interface Message{
    id: string,
    type: "THIRD_PARTY_REGISTER" | "THIRD_PARTY_BINDING" | "THIRD_PARTY_SUCCESS" | "CHAT",
    source: string,
    target: string,
    content: any,
    ack: boolean,
    time: string
}

interface MessageForm {
    type: "THIRD_PARTY_REGISTER" | "THIRD_PARTY_BINDING" | "THIRD_PARTY_SUCCESS" | "CHAT",
    source: string,
    target: string,
    content: any,
    ack: boolean,
    time: string
}

export {
    UserLoginForm,
    PhoneLoginForm,
    Message,
    MessageForm,
}