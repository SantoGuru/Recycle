import { createContext, useEffect, useReducer } from "react";

const AuthContext = createContext({
    userData: {},
    login: () => {},
    logout: () => {},
})

function authReducer(state, action) {
    if(action.type === "LOGIN"){
        localStorage.setItem("user", JSON.stringify(action.userData));
        return {
            ...state,
            userData: action.userData,
        }
    }
    if(action.type === "LOGOUT"){
        localStorage.remoteItem("user");
        return{
            ...state,
            userData: {},
        }
    }
}

export function AuthContextProvider({children}){
    const [user, dispatchUserAction] = useReducer(authReducer, { userData: {} });

    function login(userData){
        dispatchUserAction({
            type: "LOGIN",
            userData,
        });
    }

    function logout(){
        dispatchUserAction({
            type: "LOGOUT"
        })
    }

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if(storedUser) {
            dispatchUserAction({
                type: "LOGIN",
                userData: JSON.parse(storedUser),
            });
        }
    }, []);

    const userCtx = {
        user,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={userCtx}>{children}</AuthContext.Provider>
    )
}

export default AuthContext;