import React, { useEffect, useState } from "react";
import ProductReviewListComponent from "../Components/ProductReviewListComponent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import instance from "../Utils/Axios";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SubmitReviewComponent from "../Components/SubmitReviewComponent";
import ReviewChartComponent from "../Components/ReviewChartComponent";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface submit_review {
  p_id: number;
  u_id: number | null;
  rating: number;
}

interface product_review {
  name: string;
  rating: number;
  review: string;
  date: string;
  user_id: number;
  product_id: number;
}

const ReviewDrawerComponent: React.VFC<submit_review> = ({
  p_id,
  u_id,
  rating,
}) => {
  const [reviews, setReviews] = useState<product_review[]>([]);
  const [totalreview, setTotalreview] = useState<number>(0);
  const [average, setAverage] = useState<number>(0);

  useEffect(() => {
    instance
      .get("/get_summary", { params: { product_id: p_id } })
      .then((res) => {
        console.log(res);
        const data = Object.assign({}, res.data);
        if ("avg" in data) {
          setAverage(data["avg"]);
          setTotalreview(data["num"]);
        }
      });

    instance
      .get("/get_productreview", { params: { product_id: p_id } })
      .then((res) => {
        //console.log("hello");
        //console.log(res);
        const data = Object.assign({}, res.data);
        if ("review" in data) {
          setReviews(data["review"]);
          console.log(data["review"]);
        }
      });
  }, []);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const sortdateup = () => {
    setAnchorEl(null);
    instance
    .get("/get_productdateup", { params: { product_id: p_id } })
    .then((res) => {
      //console.log("hello");
      //console.log(res);
      const data = Object.assign({}, res.data);
      if ("review" in data) {
        setReviews(data["review"]);
        console.log(data["review"]);
      }
    });
  };
  const sortdatedown = () => {
    setAnchorEl(null);
    instance
      .get("/get_productdatedown", { params: { product_id: p_id } })
      .then((res) => {
        //console.log("hello");
        //console.log(res);
        const data = Object.assign({}, res.data);
        if ("review" in data) {
          setReviews(data["review"]);
          console.log(data["review"]);
        }
      });
  };
  const sortrateup = () => {
    setAnchorEl(null);
    instance
      .get("/get_productreview", { params: { product_id: p_id } })
      .then((res) => {
        //console.log("hello");
        //console.log(res);
        const data = Object.assign({}, res.data);
        if ("review" in data) {
          setReviews(data["review"]);
          console.log(data["review"]);
        }
      });
  };
  const sortratedown = () => {
    setAnchorEl(null);
    instance
      .get("/get_productreviewdown", { params: { product_id: p_id } })
      .then((res) => {
        //console.log("hello");
        //console.log(res);
        const data = Object.assign({}, res.data);
        if ("review" in data) {
          setReviews(data["review"]);
          console.log(data["review"]);
        }
      });
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

  const slide = (anchor: Anchor) => (
    <Box
    //onClick={toggleDrawer(anchor, false)}
    //onKeyDown={toggleDrawer(anchor, false)}
    >
      <div style={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            bgcolor: "background.paper",
            paddingRight: "30px",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          <CloseIcon
            sx={{
              "&:hover": {
                backgroundColor: "#D3D3D3",
              },
            }}
            onClick={toggleDrawer(anchor, false)}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            bgcolor: "background.paper",
            paddingLeft: "30px",
            paddingTop: "10px",
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
            display="inline"
            sx={{ color: "black", width: "70%", fontWeight: "600" }}
          >
            Review
          </Typography>
          {u_id != null ? (
            <SubmitReviewComponent p_id={p_id} u_id={u_id as number} />
          ) : null}
        </Box>
      </div>
      <ReviewChartComponent id={p_id} />
      <Box
        sx={{
          paddingRight: "10px",
          paddingBottom: "60px",
        }}
      >
        <Button
          id="basic-button"
          aria-controls="basic-menu"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          Sort By:
        </Button>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={sortdateup}>Oldest to Newest</MenuItem>
          <MenuItem onClick={sortdatedown}>Newest to Oldest</MenuItem>
          <MenuItem onClick={sortrateup}>Highest Rating</MenuItem>
          <MenuItem onClick={sortratedown}>Lowest Rating</MenuItem>
        </Menu>
        <ProductReviewListComponent product_review={reviews} />
      </Box>
    </Box>
  );
  return (
    <div>
      <React.Fragment>
        <Drawer
          sx={{
            width: 500,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 500,
              top: 64,
              boxSizing: "border-box",
            },
          }}
          anchor={"left"}
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
          elevation={0}
          BackdropProps={{ invisible: true }}
        >
          {slide("left")}
        </Drawer>
      </React.Fragment>
      <Grid
        container
        spacing={1}
        sx={{ cursor: "pointer" }}
        onClick={toggleDrawer("left", true)}
      >
        <Grid item>
          <Typography variant="h6" color="text.secondary" display="inline">
            Review ({totalreview})
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Rating
            name="read-only"
            value={rating}
            precision={0.5}
            readOnly
            size="small"
            sx={{
              color: "black",
              marginLeft: 1,
              marginRight: 1,
              marginTop: 0.7,
            }}
          />
          <Typography variant="h6" color="text.secondary" display="inline">
            ({average})
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <KeyboardArrowRightIcon
            fontSize="small"
            sx={{ marginTop: 0.7, alignContent: "right" }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ReviewDrawerComponent;
