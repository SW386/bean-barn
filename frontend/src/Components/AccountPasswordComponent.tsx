import React, {useEffect, useState} from 'react';
import instance from "../Utils/Axios";
import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    margin: {
      marginTop: "1em",
      marginBottom: "1em",
    },
  }));

const AccountPasswordComponent:React.VFC = () => {

    const [newPassword, setNewPassword] = useState("")
    const [clicked, setClicked] = useState(false)
    const classes = useStyles()

    const passwordChange = (event) => {
        setNewPassword(event.target.value)
    }

    const clickChange = () => {
        setClicked(true)
    }

    const clickSave = () => {
        const data = {
            password : newPassword,
        };
        instance.post('/api/update_password', data).then(()=>{
            alert("Successfully Updated Password")
        }).catch(err => alert(err))
        setNewPassword("")
        setClicked(false)
    }

    if (clicked) {
        return (<div>
            <div>
                <Button 
                variant = "contained"
                onClick={clickSave}>
                Save Password
                </Button>
            </div>
            <div>
                <TextField
                className={classes.margin}
                label="Password"
                value={newPassword}
                onChange={passwordChange}
                variant="outlined"
                />
            </div>
        </div>)
    } else {
        return (<div>
            <Button
                variant="contained"
                onClick={clickChange}>
                Change Password
            </Button>
        </div>)
    }
}

export default AccountPasswordComponent;