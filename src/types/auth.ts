interface ILogin {
    email: string
    password: string
}

interface IAuthData {
  token?: string;
}

export type {ILogin, IAuthData}