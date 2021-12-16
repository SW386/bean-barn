import React, {useState} from 'react';
import {TextField, Button, Box, Container, Card} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import instance from '../Utils/Axios';
import { useAuth } from '../Context/UserContext';
import { useHistory } from "react-router-dom";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    card: {
        margin: "auto",
        marginTop: "1em",
        padding: "1em",
        textAlign : "center",
        width : "50%"
    },
}));


const LoginComponent:React.VFC = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {setCurrentUser} = useAuth()
    const classes = useStyles()
    const history = useHistory()

    const handleChange = (event) => {

        if (event.target.name === "email") {
            setEmail(event.target.value)
        } else if (event.target.name === "password") {
            setPassword(event.target.value)
        }
    }

    const handleSubmit = () => {

        instance.post('/token/auth', {email : email, password: password})
        .then(()=>{
            instance.get('/api/userdata').then((response)=>{
                const data = Object.assign({}, response.data)
                if ("user" in data) {
                    setCurrentUser(data["user"])
                    history.push('/account')
                }
            }).catch((err)=>(console.log(err)))})
        .catch((err) => {
            alert("Username or password incorrect.")
        })
    }

    return(
        <Card className={classes.card}>
            <Typography  variant="h6">
                Login
            </Typography>
            <Container maxWidth="lg">
            <Box p={1} width="100%">
            <TextField label="Email" variant="filled" onChange = {handleChange} name="email" style={{width:"80%"}} required/>
            </Box>
            <Box p={1} width="100%">
            <TextField label="Password" variant="filled" onChange = {handleChange} name="password" style={{width:"80%"}} required/>
            </Box>
            <Box p={1} width="100%">
            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </Box>
            </Container>
        </Card>)
}

export default LoginComponent;