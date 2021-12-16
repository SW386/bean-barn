import React, { useState } from "react";
import { TextField, Button, Box, Container, Card } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import instance from "../Utils/Axios";
import Typography from "@material-ui/core/Typography";
import { checkValidEmail, checkValidZip } from "../Utils/Validation";
import { Select, InputLabel, FormControl, MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: "auto",
    marginTop: "1em",
    padding: "1em",
    width: "50%",
  },
}));

const RegisterComponent: React.VFC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Alabama");
  const [zip, setZip] = useState(0);
  const classes = useStyles();
  const history = useHistory();

  const handleChange = (event) => {

    console.log(state)

    switch (event.target.name) {
      case "email":
        setEmail(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      case "firstname":
        setFirstName(event.target.value);
        break;
      case "lastname":
        setLastName(event.target.value);
        break;
      case "address":
          setAddress(event.target.value);
          break;
      case "city":
        setCity(event.target.value);
        break;
      case "state":
        setState(event.target.value);
        break;
      case "zip":
        setZip(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    const data = {
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname,
      address: address,
      city: city,
      state: state,
      zip: zip
    };

    if (!checkValidZip (zip)) {
      alert("This is not a valid zip")
    } else if (!checkValidEmail(email)) {
      alert("This is not a valid email")
    } else {
      instance
      .post("/register", data)
      .then((res) => {
        console.log(res);
        history.push("/login");
      })
      .catch((error) => console.log(error));
    }

  };

  return (
    <Card className={classes.card}>
      <Typography variant="h6">
        Register
      </Typography>
      <Container maxWidth="lg">
        <Box p={1} width="100%">
          <TextField
            label="Email"
            variant="filled"
            onChange={handleChange}
            name="email"
            style={{ width: "80%" }}
            required
          />
        </Box>
        <Box p={1} width="100%">
          <TextField
            label="Password"
            variant="filled"
            onChange={handleChange}
            name="password"
            style={{ width: "80%" }}
            required
          />
        </Box>
        <Box p={1} width="100%">
          <TextField
            label="First Name"
            variant="filled"
            onChange={handleChange}
            name="firstname"
            style={{ width: "80%" }}
            required
          />
        </Box>
        <Box p={1} width="100%">
          <TextField
            label="Last Name"
            variant="filled"
            onChange={handleChange}
            name="lastname"
            style={{ width: "80%" }}
            required
          />
        </Box>
        <Box p={1} width="100%">
          <TextField
            label="address"
            variant="filled"
            onChange={handleChange}
            name="address"
            style={{ width: "80%" }}
            required
          />
        </Box>
        <Box p={1} width="100%">
          <TextField
            label="city"
            variant="filled"
            onChange={handleChange}
            name="city"
            style={{ width: "80%"}}
            required
          />
        </Box>
        <Box p={1} width="100%">
        <FormControl required variant="standard" style={{width:"100%"}}>
          <InputLabel style={{paddingLeft:"0.8em"}}>state</InputLabel>
            <Select
              value={state}
              name = "state"
              label="state"
              style={{width: "80%", paddingLeft:"0.65em"}}
              onChange={handleChange}>
              <MenuItem value={"Alabama"}>Alabama</MenuItem>
              <MenuItem value={"Alaska"}>Alaska</MenuItem>
              <MenuItem value={"Arizona"}>Arizona</MenuItem>
              <MenuItem value={"Arkansas"}>Arkansas</MenuItem>
              <MenuItem value={"California"}>California</MenuItem>
              <MenuItem value={"Colorado"}>Colorado</MenuItem>
              <MenuItem value={"Connecticut"}>Connecticut</MenuItem>
              <MenuItem value={"Delaware"}>Delaware</MenuItem>
              <MenuItem value={"Florida"}>Florida</MenuItem>
              <MenuItem value={"Georgia"}>Georgia</MenuItem>
              <MenuItem value={"Hawaii"}>Hawaii</MenuItem>
              <MenuItem value={"Idaho"}>Idaho</MenuItem>
              <MenuItem value={"Illinois"}>Illinois</MenuItem>
              <MenuItem value={"Indiana"}>Indiana</MenuItem>
              <MenuItem value={"Iowa"}>Iowa</MenuItem>
              <MenuItem value={"Kansas"}>Kansas</MenuItem>
              <MenuItem value={"Kentucky"}>Kentucky</MenuItem>
              <MenuItem value={"Louisiana"}>Louisiana</MenuItem>
              <MenuItem value={"Maine"}>Maine</MenuItem>
              <MenuItem value={"Maryland"}>Maryland</MenuItem>
              <MenuItem value={"Massachusetts"}>Massachusetts</MenuItem>
              <MenuItem value={"Michigan"}>Michigan</MenuItem>
              <MenuItem value={"Minnesota"}>Minnesota</MenuItem>
              <MenuItem value={"Mississippi"}>Mississippi</MenuItem>
              <MenuItem value={"Missouri"}>Missouri</MenuItem>
              <MenuItem value={"Montana"}>Montana</MenuItem>
              <MenuItem value={"Nebraska"}>Nebraska</MenuItem>
              <MenuItem value={"Nevada"}>Nevada</MenuItem>
              <MenuItem value={"New Hampshire"}>New Hampshire</MenuItem>
              <MenuItem value={"New Jersey"}>New Jersey</MenuItem>
              <MenuItem value={"New Mexico"}>New Mexico</MenuItem>
              <MenuItem value={"New York"}>New York</MenuItem>
              <MenuItem value={"North Carolina"}>North Carolina</MenuItem>
              <MenuItem value={"North Dakota"}>North Dakota</MenuItem>
              <MenuItem value={"Ohio"}>Ohio</MenuItem>
              <MenuItem value={"Oklahoma"}>Oklahoma</MenuItem>
              <MenuItem value={"Oregon"}>Oregon</MenuItem>
              <MenuItem value={"Pennsylvania"}>Pennsylvania</MenuItem>
              <MenuItem value={"Rhode Island"}>Rhode Island</MenuItem>
              <MenuItem value={"South Carolina"}>South Carolina</MenuItem>
              <MenuItem value={"South Dakota"}>South Dakota</MenuItem>
              <MenuItem value={"Tennessee"}>Tennessee</MenuItem>
              <MenuItem value={"Texas"}>Texas</MenuItem>
              <MenuItem value={"Utah"}>Utah</MenuItem>
              <MenuItem value={"Vermont"}>Vermont</MenuItem>
              <MenuItem value={"Virginia"}>Virginia</MenuItem>
              <MenuItem value={"Washington"}>Washington</MenuItem>
              <MenuItem value={"West Virginia"}>West Virginia</MenuItem>
              <MenuItem value={"Wisconsin"}>Wisconsin</MenuItem>
              <MenuItem value={"Wyoming"}>Wyoming</MenuItem>
          </Select>
          </FormControl>
        </Box>
        <Box p={1} width="100%">
          <TextField
            label="zip"
            variant="filled"
            onChange={handleChange}
            name="zip"
            style={{ width: "80%" }}
            required
          />
        </Box>
        <Box p={1} width="100%">
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Container>
    </Card>
  );
};

export default RegisterComponent;
