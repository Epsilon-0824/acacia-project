import { http } from "./http.service";

export async function login(username: string, password:string){
    return await http.post('/v1/auth/login', {
        username: username,
        password: password
    });
}

export function logout(){
    localStorage.removeItem('token');
}

export function isTokenExpired(token: any){
    const currentTime = Math.floor(Date.now() / 1000);
    return token.expired_in < currentTime;
}