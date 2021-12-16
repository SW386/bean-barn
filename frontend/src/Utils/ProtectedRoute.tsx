import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../Context/UserContext';
import LoadingPage from '../Pages/LoadingPage';

const protectedRoute = (Comp) => (props) => {

    const history = useHistory()
    const {currentUser} = useAuth()
    const [loading, setLoading] = useState(true)

    const checkAuthState = () => {
        if (currentUser !== null) {
            setLoading(false)
            return
        } 
        history.push('/login')
    }

    useEffect(() => {
        checkAuthState()
    })

    if (loading) {
        return <LoadingPage/>
    } else {
        return <Comp {...props} />
    }

}

export default protectedRoute