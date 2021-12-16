import React, {useEffect, useState} from 'react';
import NavbarComponent from '../Components/NavbarComponent';
import Box from "@material-ui/core/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useParams } from 'react-router-dom'
import { headCells, InventoryItem, getInventoryItems, InventoryQueryParams, InventoryResponse } from '../Utils/SellerUtility';
import instance from '../Utils/Axios';
import UncontrolledSellerTableComponent from '../Components/Seller/UncontrolledSellerTableComponent';
import SellerReviewsComponent from '../Components/Seller/SellerReviewsComponent';
import SubmitSellerReviewComponent from '../Components/Seller/SubmitSellerReviewComponent';
import { Typography } from '@material-ui/core';

import './PublicPage.css'

interface PublicUser {
    id : number,
    email : string, 
    firstname : string,
    lastname : string,
    streetAddress: string,
    city: string,
    state: string,
    zip: number,
    isSeller: boolean
};

interface Review {
    name: string
    text: string
    rating: number
}

const PublicPage:React.VFC = () => {

    const { email } = useParams()
    const [publicUser, setPublicUser] = useState<PublicUser>({
        id : -1,
        email : "",
        firstname : "",
        lastname :"",
        streetAddress: "",
        city: "",
        state: "",
        zip: -1,
        isSeller: false

    })

    const [reviews, setReviews] = useState<Review[]>([])
    
    useEffect(() => {
        instance.get("/public/user", { params: { email : email } })
        .then((res) => {
          const data = Object.assign({}, res.data);
          if ("public" in data) {
            setPublicUser(data["public"]);
          }
        });
    }, []);

    useEffect(() => {
        getReviews()
    }, [publicUser])
        
    function formatAddress({ streetAddress, city, state, zip }) {
        return `${streetAddress} ${city} ${state} ${zip}`;
    }

    const getReviews = () => {
        if (publicUser.id !== -1) {
            instance.post('/api/get_seller_reviews', {seller_id: publicUser.id}).then(res => {
                const reviews = (res.data as Review[])
                setReviews(reviews)
            })
        }
    }

    return(<div>   
        <NavbarComponent/>
        <Box style={{ paddingTop: "70px" }}>
            <CssBaseline />
            <div>
                <Typography>Name: {publicUser.firstname} {publicUser.lastname}</Typography>
                <Typography>Account number: {publicUser.id}</Typography>
            </div>
        </Box>
        <div className="publicInventoryContainer">
            {(publicUser.isSeller)? 
                <div>
                    <Typography>Email: {publicUser.email}</Typography>
                    <Typography>Address: {formatAddress(publicUser)}</Typography>
                    <UncontrolledSellerTableComponent
                    tableHeadCells={headCells}
                    mutable={false}
                    getInventoryItemsCallback={getInventoryItems(publicUser.id)}
                    title={`What ${publicUser.firstname} is selling`}
                    />
                </div>
                : null
            }

            <h2 style={{textAlign: 'center'}}>
                {`${publicUser.firstname}'s Reviews'`}
            </h2>

            <SellerReviewsComponent reviews={reviews}/>
            <br />
            <div style={{float: 'right'}}>
                <SubmitSellerReviewComponent sellerId={publicUser.id} updateRows={getReviews}/>
                <br />
            </div>
        </div>
    </div>)
}

export default PublicPage;