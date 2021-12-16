import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Container from "@mui/material/Container";
import { Button, TextField } from "@material-ui/core";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import { makeStyles } from "@material-ui/core/styles";
import instance from "../Utils/Axios";
import { checkIsPositive, checkValidZip } from "../Utils/Validation";
import AccountPasswordComponent from "./AccountPasswordComponent";

interface Props {
  user: {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    address: string;
    zip: number;
    city: string;
    state: string;
    balance: number;
  };
  setUser: Function;
}

const useStyles = makeStyles((theme) => ({
  margin: {
    marginTop: "1em",
    marginBottom: "1em",
  },
  padding: {
    padding: "0.5em",
    textAlign: "center",
    height : "100%"
  },
}));

const textStyling = {
  style: {
    fontSize : "0.8em",
    textAlign: "center" as const,
    marginTop: "0.7em",
    marginBottom: "0.4em",
    width: "15em",
    height : "1em"
  },
};

const nameStyling = {
  style: {
    fontSize : "0.8em",
    textAlign: "center" as const,
    marginTop: "0.7em",
    marginBottom: "0.4em",
    width: "7.5em",
    height : "1em"
  },
};

const addressStyling = {
  style: {
    fontSize : "0.8em",
    textAlign: "center" as const,
    marginTop: "0.7em",
    marginBottom: "0.4em",
    width: "3.75em",
    height : "1em"
  },
};

const AccountComponent: React.VFC<Props> = ({ user, setUser }) => {

  const [balance, setBalance] = useState(user.balance);
  const [address, setAddress] = useState(user.address);
  const [firstname, setFirstName] = useState(user.firstname);
  const [lastname, setLastName] = useState(user.lastname);
  const [email, setEmail] = useState(user.email);
  const [city, setCity] = useState(user.city);
  const [state, setState] = useState(user.state);
  const [zip, setZip] = useState(user.zip);
  const classes = useStyles();

  const [editBalance, setEditBalance] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editAll, setEditAll] = useState(false);

  useEffect(() => {
    if (email === "") {
      setBalance(user.balance);
      setAddress(user.address);
      setFirstName(user.firstname);
      setLastName(user.lastname);
      setEmail(user.email);
      setCity(user.city);
      setZip(user.zip);
      setState(user.state);
    }
  });

  const onClickEdit = (event) => {
    switch (event.currentTarget.name) {
      case "name":
        setEditName(true);
        break;
      case "address":
        setEditAddress(true);
        break;
      case "balance":
        setEditBalance(true);
        break;
      case "all":
        setEditAll(true);
        setEditName(true);
        setEditEmail(true);
        setEditAddress(true);
        setEditBalance(true);
        break;
      default:
        break;
    }
  };

  const onClickSave = (event) => {

    if (checkIsPositive(balance) && checkValidZip(zip)) {
      switch (event.currentTarget.name) {
        case "name":
          setEditName(false);
          break;
        case "address":
          setEditAddress(false);
          break;
        case "balance":
          setEditBalance(false);
          break;
        case "all":
          setEditAll(false);
          setEditName(false);
          setEditEmail(false);
          setEditAddress(false);
          setEditBalance(false);
          break;
        default:
          break;
      }
      const data = {
        email: email,
        balance: balance,
        address: address,
        firstname: firstname,
        lastname: lastname,
        city: city,
        state: state,
        zip: zip,
      };
  
      instance
        .post("/api/modify_user", data)
        .then(
          setUser({
            id: user.id,
            email: email,
            balance: balance,
            address: address,
            firstname: firstname,
            lastname: lastname,
            city: city,
            state: state,
            zip: zip,
          })
        )
        .catch((error) => {
          alert(error);
        });

    } else {
      if (!checkIsPositive(balance) && !checkValidZip((zip))) {
        alert("The balance and zip are not valid")
      } else if (!checkIsPositive(balance)) {
        alert("The balance is not valid")
      } else {
        alert("The zip is not valid")
      }
    }
  };

  const onValueChange = (event) => {
    switch (event.target.name) {
      case "firstname":
        setFirstName(event.target.value);
        break;
      case "lastname":
        setLastName(event.target.value);
        break;
      case "address":
        setAddress(event.target.value);
        break;
      case "balance":
        setBalance(event.target.value);
        break;
      case "zip":
        setZip(event.target.value);
        break;
      case "city":
        setCity(event.target.value);
        break;
      case "state":
        setState(event.target.value);
        break;
      default:
        break;
    }
  };

  return (
      <Container className={classes.margin} style={{ paddingTop: "70px" }}>
        <Grid container spacing={3}>
          <Grid item xs>
            <Paper className={classes.padding}>
              <AccountBoxIcon />
              {editName ? (
                <div>
                  <div>
                    <TextField
                      value={firstname}
                      label = "First Name"
                      inputProps={nameStyling}
                      onChange={onValueChange}
                      name="firstname"
                      variant="outlined"
                    />
                    <TextField
                      value={lastname}
                      label = "Last Name"
                      inputProps={nameStyling}
                      onChange={onValueChange}
                      name="lastname"
                      variant="outlined"
                    />
                  </div>
                  <Button
                    variant="contained"
                    size="small"
                    name="name"
                    onClick={onClickSave}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <div>
                  <div className={classes.margin}>
                    {firstname} {lastname}
                  </div>
                  <Button
                    variant="contained"
                    size="small"
                    name="name"
                    onClick={onClickEdit}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </Paper>
          </Grid>
          <Grid item xs>
            <Paper className={classes.padding}>
              <EmailIcon />
              <div>
                <div className={classes.margin}>{email}</div>
              </div>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs>
            <Paper className={classes.padding}>
              <HomeIcon />
              {editAddress ? (
                <div>
                  <div>
                    <TextField
                      label = "Address"
                      inputProps={addressStyling}
                      value={address}
                      onChange={onValueChange}
                      name="address"
                      variant="outlined"
                    />
                    <TextField
                      label = "City"
                      inputProps={addressStyling}
                      value={city}
                      onChange={onValueChange}
                      name="city"
                      variant="outlined"
                    />
                    <TextField
                      label = "State"
                      inputProps={addressStyling}
                      value={state}
                      onChange={onValueChange}
                      name="state"
                      variant="outlined"
                    />
                    <TextField
                      label = "Zip"
                      inputProps={addressStyling}
                      value={zip}
                      onChange={onValueChange}
                      name="zip"
                      variant="outlined"
                    />
                  </div>
                  <Button
                    variant="contained"
                    size="small"
                    name="address"
                    onClick={onClickSave}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <div>
                  <div className={classes.margin}>
                    {address} {city} {state} {zip}
                  </div>
                  <Button
                    variant="contained"
                    size="small"
                    name="address"
                    onClick={onClickEdit}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </Paper>
          </Grid>
          <Grid item xs>
            <Paper className={classes.padding}>
              <AccountBalanceIcon />
              {editBalance ? (
                <div>
                  <div>
                    <TextField
                      label="Balance"
                      inputProps={textStyling}
                      value={balance}
                      onChange={onValueChange}
                      name="balance"
                      variant="outlined"
                    />
                  </div>
                  <Button
                    variant="contained"
                    size="small"
                    name="balance"
                    onClick={onClickSave}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <div>
                  <div className={classes.margin}>{balance}</div>
                  <Button
                    variant="contained"
                    size="small"
                    name="balance"
                    onClick={onClickEdit}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </Paper>
          </Grid>
        </Grid>
        <div>
        {editAll ? (
          <Button
            variant="contained"
            name="all"
            className={classes.margin}
            onClick={onClickSave}
          >
            Save All
          </Button>
        ) : (
          <Button
            variant="contained"
            name="all"
            className={classes.margin}
            onClick={onClickEdit}
          >
            Edit All
          </Button>
        )}
        </div>
        <div>
          <AccountPasswordComponent/>
        </div>
      </Container>
  );
};

export default AccountComponent;
