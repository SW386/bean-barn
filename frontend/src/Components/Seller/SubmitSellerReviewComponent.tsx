import ProductReviewListComponent from "../ProductReviewListComponent";
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
import instance from "../../Utils/Axios";

interface submit_review {
    sellerId: number
    updateRows: () => void
}
const SubmitReviewComponent: React.VFC<submit_review> = ({ sellerId, updateRows }) => {
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
      seller_id: sellerId,
      description: description,
      rating: value,
    };
    console.log(data);
    instance
          .post("/api/submit_seller_review", data)
          .then((res) => {
            updateRows()
          })
          .catch((error) => alert(error.response.data.errMessage))
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
        <DialogTitle>My Review</DialogTitle>
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
            id="name"
            multiline
            rows={4}
            label="Example: This seller is amazing!"
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
