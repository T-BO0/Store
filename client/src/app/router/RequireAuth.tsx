import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAppSelector } from "../store/configureStore"
import AppUnauthorized from "../components/AppUnauthorized";

interface Props{
    roles?: string[];
}

export default function RequireAuth({roles}:Props){
    const {user} = useAppSelector(state => state.account)
    const location = useLocation();
    
    if (!user) return <Navigate to='/login' state={{from: location}}></Navigate>

    if(roles && !roles.some(r => user.roles.includes(r))) return <AppUnauthorized/>

    return <Outlet/>
}