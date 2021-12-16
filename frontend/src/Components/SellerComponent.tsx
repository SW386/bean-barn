import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";


interface IProps {
    seller: {
        id : number,
        email : string,
        firstname : string,
        lastname : string,
        address : string,
        balance : number
    };
}


const SellerComponent: React.VFC<IProps> = ({ seller }) => {

    return (
        <Link to={{pathname: "/EachPage", state: {p: seller} }} style={{ textDecoration: "none" }}>
            <Card sx={{ maxWidth: 500 }}>
                <CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {seller.id}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Link>
    );
};

export default SellerComponent;
