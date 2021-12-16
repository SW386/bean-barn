import React from 'react';
import NavbarComponent from '../Components/NavbarComponent';
import RegisterComponent from '../Components/RegisterComponent';
import Box from "@material-ui/core/Box";
import CssBaseline from "@mui/material/CssBaseline";

const RegisterPage:React.VFC = () => {

    return(<div>   
        <NavbarComponent/>
        <Box style={{ paddingTop: "70px" }}>
            <CssBaseline />
            <RegisterComponent/>
        </Box>
    </div>)
}

export default RegisterPage;