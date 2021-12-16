import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";


interface IProps {
    product: {
        id:number;
        seller_id:number;
        quantity: number;
        name: string;
        price: number;
        description: string;
        img_link:string;
        category: string;
        available: boolean;
    };
}


const ProductComponent: React.VFC<IProps> = ({ product }) => {

    return (
        <Link to={{pathname: "/EachPage", state: {p: product} }} style={{ textDecoration: "none" }}>
            <Card sx={{ maxWidth: 500 }}>
                <CardActionArea>
                    <CardMedia component="img" height="140" image={product.img_link} alt="product" />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {product.name}
                            <div>${product.price}</div>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {product.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Link>
    );
};

export default ProductComponent;
