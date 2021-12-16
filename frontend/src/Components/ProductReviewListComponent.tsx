import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";

interface IProps {
  product_review: {
    name: string;
    rating: number;
    review: string;
    date: string;
    user_id: number;
    product_id: number;
  }[];
}

const ProductReviewListComponent: React.VFC<IProps> = ({ product_review }) => {
  return (
    <ul>
      {product_review.map((product_review) => {
        return (
          <div>
            <Typography gutterBottom variant="h5" component="div">
              {product_review.name}

              <Rating
                name="read-only"
                value={product_review.rating}
                precision={0.5}
                readOnly
                size="small"
                sx={{
                  color: "black",
                  marginLeft: 1,
                  marginTop: 0.7,
                }}
              />
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {product_review.review}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                marginBottom: 2,
              }}
            >
              {product_review.date}
            </Typography>
          </div>
        );
      })}
    </ul>
  );
};

export default ProductReviewListComponent;
