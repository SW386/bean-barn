import React from "react";
import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { useHistory } from "react-router-dom";
import Typography from "@mui/material/Typography";

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
    rating:number
  }[];
}

const ProductlstComp: React.VFC<IProps> = ({ product }) => {
  const history = useHistory();


  return (
    <ImageList cols={3} gap={40}>
      {product.map((product) => (
        <Link
          to={{ pathname: `/EachPage/${product.id}`, state: { p: product } }}
          style={{ textDecoration: "none" }}
          
        >
          <ImageListItem key={product.img_link}>
            <img
              src={`${product.img_link}?w=248&fit=crop&auto=format`}
              srcSet={`${product.img_link}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={product.name}
              loading="lazy"
            />
            <ImageListItemBar
              title={product.name}
              subtitle={<span>$ {product.price}</span>}
              position="below"
              sx={{ color: "black" }}
            />
            <Rating
            name="read-only"
            value={product.rating}
            precision={0.5}
            readOnly
            size="small"
            sx={{
              color: "black",
            }}
          />
        
          </ImageListItem>
        </Link>
      ))}
    </ImageList>
  );
};
export default ProductlstComp;
