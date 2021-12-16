import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/UserContext";
import instance from "../Utils/Axios";
import Container from "@mui/material/Container";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

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
    flexGrow: 1,
    color: "black",
    paddingRight: "2em",
    width: "100%"
  },
  logo: {
    maxWidth: 60,
    flexGrow: 1,
    cursor: "pointer",
  },
  navlinks: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    display: "flex",
  },
  navicon: {
    marginLeft: theme.spacing(3),
    display: "flex",
    color: "black",
  },
  navright: {
    marginLeft: theme.spacing(2),
    display: "flex",
    color: "black",
    cursor: "pointer",
  },
}));

const NavbarComponent = () => {
  const classes = useStyles();
  const { currentUser, setCurrentUser } = useAuth();

  var isLoggedIn = false;
  if (currentUser !== null) {
    isLoggedIn = true;
  }

  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      instance.get("/api/check_seller").then(res => {
        const rawData = res.data as any
        setIsSeller(rawData.isSeller)
      })
    }
  }, [isLoggedIn, currentUser])

  const onSignOut = () => {
    instance.post("/token/remove");
    setCurrentUser(null);
  };

  const inventory = isSeller ? (
    <Link to="/seller_inventory" style={{ textDecoration: "none" }}>
      <Typography variant="subtitle1" className={classes.title}>
        Inventory
      </Typography>
    </Link>
  ) : <></>

  const sellerPurchases = isSeller ? (
    <Link to="/seller_purchases" style={{ textDecoration: "none" }}>
      <Typography variant="subtitle1" className={classes.title}>
        SellerOrders
      </Typography>
    </Link>
  ) : <></>

  return (
    <AppBar position="absolute" style={{ background: "white" }} elevation={0}>
      <CssBaseline />
      <Toolbar style={{justifyContent: "space-between", alignContent: "center"}}>
        <Link to="/" style={{textDecoration: "none", width: "33.33%"}}>
          <Paper elevation={0}>
            <img
              src="https://i.imgur.com/H3Xz2Nm.png"
              alt="logo"
              className={classes.logo}
            />
          </Paper>
        </Link>

        <div style={{display: "flex", width: "33.33%", justifyContent: "center"}}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Typography variant="subtitle1" className={classes.title}>
            Home
          </Typography>
        </Link>

        <Link to="/product" style={{ textDecoration: "none" }}>
          <Typography variant="subtitle1" className={classes.title}>
            Product
          </Typography>
        </Link>
        {inventory}
        <Link to="/user_orders" style={{ textDecoration: "none" }}>
          <Typography variant="subtitle1" className={classes.title}>
            Orders
          </Typography>
        </Link>
        {sellerPurchases}
        </div>

        <div style={{display: "flex", width: "33.33%", justifyContent: "flex-end"}}>
          <Link to="/account" style={{ textDecoration: "none"}}>
            <AccountCircleOutlinedIcon
              style={{ fill: "black", float: "right" }}
              fontSize="small"
              className={classes.navicon}
            />

            {/* <Typography  variant="h6" className={classes.title}>
                    Account
                  </Typography> */}
          </Link>
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <ShoppingCartOutlinedIcon
              style={{ fill: "black" }}
              fontSize="small"
              className={classes.navicon}
            />
            {/* <Typography  variant="h6" className={classes.title}>
                      Cart
                  </Typography> */}
          </Link>

          {loggedIn ? (
            <Link to="/login" style={{ textDecoration: "none" }}>
            <Typography
              variant="subtitle1"
              className={classes.navright}
              onClick={onSignOut}
            >
              Sign Out
            </Typography>
            </Link>
          ) : (
            [
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Typography
                  variant="subtitle1"
                  className={classes.navright}
                  display="inline"
                >
                  Sign In
                </Typography>
              </Link>,

              <Link to="/register" style={{ textDecoration: "none" }}>
                <Typography
                  variant="subtitle1"
                  className={classes.navright}
                  display="inline"
                >
                  Sign Up
                </Typography>
              </Link>,
            ]
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};
export default NavbarComponent;
