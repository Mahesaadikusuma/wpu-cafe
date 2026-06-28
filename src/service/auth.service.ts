import { environment } from "../constants/environment";
import type { ILogin } from "../types/auth";
import fetchAPI from "../utils/fetch";

export const login = async (payload: ILogin) => {
    return fetchAPI(`${environment.API_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}