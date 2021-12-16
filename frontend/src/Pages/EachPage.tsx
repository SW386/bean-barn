import React, { useEffect, useState } from "react";
import NavbarComponent from "../Components/NavbarComponent";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import ProductReviewListComponent from "../Components/ProductReviewListComponent";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Divider from "@mui/material/Divider";
import { TextField } from "@material-ui/core";
import { useAuth } from "../Context/UserContext";
import instance from "../Utils/Axios";
import { useHistory } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import protectedRoute from "../Utils/ProtectedRoute";
import ReviewDrawerComponent from "../Components/ReviewDrawerComponent";
import { useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface IProps {
  product: {
    id: number;
    seller_id: number;
    quantity: number;
    name: string;
    price: number;
    description: string;
    img_link: string;
    category: string;
    available: boolean;
    rating: number;
  };
}

const EachPage: React.VFC = () => {
  const baseProduct = {
    id: -1,
    seller_id: -1,
    quantity: 0,
    name: "",
    price: 0,
    description: "",
    img_link: "",
    category: "",
    available: true,
    rating: 0,
  };

  const baseUser = {
    id: -1,
    email: "",
    firstname: "",
    lastname: "",
    address: "",
    balance: 0,
    zip: 0,
    city: "",
    state: "",
  };
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const [quant, setQuant] = React.useState(1);
  const [product, setProduct] = useState<IProps["product"]>(baseProduct);
  const [user, setUser] = useState(baseUser);
  const { currentUser, setCurrentUser } = useAuth();
  console.log(currentUser);
  const [email, setemail] = useState("");
  const { id } = useParams();
  console.log(id);
  const [product_id, setProduct_id] = React.useState(id);

  useEffect(() => {
    instance
      .get("/get_singleProduct", {
        params: {
          product_id: product_id,
        },
      })
      .then((res) => {
        const data = Object.assign({}, res.data);
        if ("product" in data) {
          setProduct(data["product"][0]);
        }
      });

    instance
      .get("/getemail", {
        params: {
          product_id: product_id,
        },
      })
      .then((res) => {
        console.log(res);
        const data = Object.assign({}, res.data);
        if ("email" in data) {
          setemail(data["email"]);
        }
      });
  }, []);
  const Img = styled("img")({
    margin: "auto",
    //display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  });

  const addcart = () => {
    const data = {
      id: product_id,
      //product_id: product_id,
      quantity: quant,
    };
    //console.log(data);
    //console.log(product)
    instance
      .post("/api/add_cart", data)
      .then((res) => {
        console.log(res);
        <Alert severity="success">Added to Cart</Alert>;
        setOpen(true);
        //alert("Added to Cart")
      })
      .catch((error) => alert(error.response.data.errMessage));
  };

  const handleChangeQuant = (event) => {
    setQuant(event.target.value);
    //console.log(quant);
  };

  type Anchor = "left";
  const [state, setState] = React.useState({ left: false });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  return (
    <div>
      <Collapse in={open}>
                  <Alert
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ 
                      mt: 8
                    }}
                  >
                    Added to Cart
                  </Alert>
                </Collapse>
      <NavbarComponent />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          //width : '100%',
          "& > :not(style)": {
            m: 1,
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Paper
              sx={{
                p: 5,
                margin: "auto",
                //maxWidth: 800,
                flexGrow: 1,
                paddingTop: "80px",
                background: "transparent",
                overflow: "auto",
              }}
              elevation={0}
            >
              <Grid container spacing={1}>
                <Img alt="complex" src={product.img_link} />
              </Grid>
            </Paper>
          </Grid>

          <Grid item md={6}>
            <Paper
              sx={{
                p: 5,
                margin: "auto",
                //maxWidth: 600,
                flexGrow: 1,
                paddingTop: "80px",
                background: "transparent",
                overflow: "auto",
              }}
              elevation={0}
            >
              <Typography gutterBottom variant="h3" component="div">
                {product.name}
              </Typography>
              <Typography variant="subtitle1" component="div">
                Category: {product.category}
              </Typography>

              <Link
                to={{
                  pathname: `/public/${email}`,
                }}
                style={{ textDecoration: "none" }}
              >
                <Typography variant="subtitle1" component="div">
                  Seller: {email}
                </Typography>
              </Link>

              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>

              <Typography variant="subtitle1" component="div">
                $ {product.price}
              </Typography>
              <Typography variant="subtitle1" component="div">
                Quantity: {product.quantity}
              </Typography>

              <Divider />
              <ReviewDrawerComponent
                p_id={product_id}
                u_id={currentUser ? currentUser.id : null}
                rating={product.rating}
              />

              <Divider />

              <TextField onChange={handleChangeQuant} type="number" />

              <Typography sx={{ cursor: "pointer" }} variant="body2">
                <Button
                  onClick={addcart}
                  variant="contained"
                  disableElevation
                  style={{ width: "85%", borderRadius: 0 }}
                  sx={{
                    m: 0.5,
                    backgroundColor: "black",
                    "&:hover": {
                      backgroundColor: "black",
                    },
                  }}
                >
                  Add to Cart &#8226; ${(product.price * quant).toFixed(2)}
                </Button>
                
                <Button
                  variant="contained"
                  disableElevation
                  style={{ width: "4%", borderRadius: 0 }}
                  sx={{
                    backgroundColor: "black",
                    "&:hover": {
                      backgroundColor: "black",
                    },
                  }}
                >
                  <FavoriteBorderIcon fontSize="medium" />
                </Button>
                
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default protectedRoute(EachPage);
