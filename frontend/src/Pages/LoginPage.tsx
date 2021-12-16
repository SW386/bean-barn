import React from 'react';
import NavbarComponent from '../Components/NavbarComponent';
import LoginComponent from '../Components/LoginComponent';
import Box from "@material-ui/core/Box";
import CssBaseline from "@mui/material/CssBaseline";

const LoginPage:React.VFC = () => {

    return(<div>   
        <NavbarComponent/>
        <Box style={{ paddingTop: "70px" }}>
            <CssBaseline />
            <LoginComponent/>
        </Box>
    </div>)
}

export default LoginPage;