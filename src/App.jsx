import React from "react";
import {SockJSProvider} from "@/context/SockJSContext.jsx";
import AppRoutes from "@/routes/AppRoutes.jsx";
import {AuthProvider} from "@/context/AuthContext.jsx";
import {SkeletonTheme} from "react-loading-skeleton";
import {CurtainProvider} from "@/context/CurtainContext.jsx";

function App() {


    return (
        <AuthProvider>
            <SockJSProvider>
                <CurtainProvider>
                    <AppRoutes />
                </CurtainProvider>
            </SockJSProvider>
        </AuthProvider>
    );
}

export default App;
