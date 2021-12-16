import React from "react";
import NavbarComponent from "../Components/NavbarComponent";
import protectedRoute from "../Utils/ProtectedRoute";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { Typography, makeStyles, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  typography: {
    fontFamily: [
      '"Arial Narrow"',
      "Arial",
      '"Helvetica Condensed"',
      "Helvetica",
      "sans-serif",
    ].join(","),
  },
  title: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(6),
    flexGrow: 1,
    color: "black",
    paddingRight: "2em",
    fontWeight: 100,
  },
  sub1: {
    marginLeft: theme.spacing(6),
    marginTop: theme.spacing(2),
    flexGrow: 1,
    color: "black",
    paddingRight: "2em",
  },
  button: {
    marginLeft: theme.spacing(8),
    marginTop: theme.spacing(35),
    marginBottom: theme.spacing(5),
    backgroundColor: "white",
  },
}));

const HomePage: React.VFC = () => {
  const classes = useStyles();
  const styles = {
    paperContainer: {
      backgroundImage: `url(https://i.imgur.com/Lf2pMNi.jpg)`,
      paddingTop: '70px',
    },
  };
  return (
    <div>
      <NavbarComponent />
    <div >
      <Paper style={styles.paperContainer} >
        <Box p={1}>
          <Typography variant="h1" className={classes.title}>
            Bean Barn
          </Typography>

          <Typography variant="h6" className={classes.sub1}>
            Green Beans, Black Beans, and More
          </Typography>
        </Box>
        <Link to="/product" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            className={classes.button}
            disableElevation
            size="medium"
            style={{borderRadius: 0 }}
          >
            shop now
          </Button>
        </Link>
      </Paper>
      </div>
    </div>
  );
};

export default HomePage;
