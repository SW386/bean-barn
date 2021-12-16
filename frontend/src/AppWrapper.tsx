import React, {useEffect, useState} from 'react';
import { AuthProvider } from './Context/UserContext';
import App from './App';

const AppWrapper : React.VFC = () => {

    return (<AuthProvider user={null}>
        <App/>
    </AuthProvider>)

}

export default AppWrapper;