import {useContext} from "react";
import {AuthContext} from "./context/AuthContext.jsx";
import {Navigate} from "react-router-dom";

const ProtectedRoute =({children})=>{
    const {user , isLoading} = useContext(AuthContext)

    if(isLoading) return <span>Loading...</span>

    if(!user) return <Navigate to="/login" replace />


    return children
}


export default ProtectedRoute