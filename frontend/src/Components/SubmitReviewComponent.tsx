import ProductReviewListComponent from "../Components/ProductReviewListComponent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Rating from "@mui/material/Rating";
import instance from "../Utils/Axios";

interface submit_review {
  p_id: number;
  u_id: number;
}
const SubmitReviewComponent: React.VFC<submit_review> = ({ p_id, u_id }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<number | null>(5);
  const [description, setDescription] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = () => {
    setOpen(false);

    const data = {
      user_id: u_id,
      product_id: p_id,
      description: description,
      rating: value,
    };
    console.log(data);
    instance
          .post("/submit_productreview", data)
          .then((res) => {
            console.log(res);
            //history.push("/login");
          })
          .catch((error) => console.log(error));

    //console.log(description)
  };
  const handleChange = (event) => {
    setDescription(event.target.value);
  };

  return (
    <div>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#D3D3D3",
          color: "black",
          "&:hover": {
            backgroundColor: "#D3D3D3",
          },
        }}
        disableElevation
        size="small"
        style={{ borderRadius: 0 }}
        onClick={handleClickOpen}
      >
        Write Review
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle>My Review for these Beans</DialogTitle>
        <DialogContent>
          <Rating
            name="simple-controlled"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
          <DialogContentText>Review</DialogContentText>
          <TextField
            autoFocus
            //margin="dense"
            id="name"
            multiline
            rows={4}
            label="Example: I thought these green beans were too green for my taste"
            fullWidth
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SubmitReviewComponent;
