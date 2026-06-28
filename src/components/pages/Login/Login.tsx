import { useState, type FormEvent } from "react";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { login } from "../../../service/auth.service";
import { setLocalStorage } from "../../../utils/storage";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const handleLogin = async (e: FormEvent) => {
        try {
            e.preventDefault();
            setLoading(true)
            const form  = e.target as HTMLFormElement;

            const payload = {
                email: form.email.value,
                password: form.password.value,
            }
            const result = await login(payload);
            setLocalStorage("auth", result)
            // return <Navigate to="/orders" replace /> 
            return navigate('/orders', {replace: true}); 
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return(
        <main className="flex justify-center items-center min-h-screen bg-gray-50 p-4 " >
            <div className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-4xl text-black font-bold">Login</h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full" >
                    <Input  
                        label="Email"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email" 
                                                                        
                        required
                        />
                    <Input  
                        label="Password"
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"                                                    
                        required
                        />
                    <Button type="submit" color="primary" disabled={loading} >{loading ? 'Loading...' : 'Login'}</Button>
                </form>
            </div>
        </main>
    )
}

export default Login