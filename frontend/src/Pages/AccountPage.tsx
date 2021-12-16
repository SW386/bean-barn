import React, {useEffect, useState} from 'react';
import NavbarComponent from '../Components/NavbarComponent';
import AccountComponent from '../Components/AccountComponent';
import AccountPurchaseComponent from '../Components/AccountPurchaseComponent';
import protectedRoute from '../Utils/ProtectedRoute';
import { useAuth } from '../Context/UserContext';
import BecomeSellerComponent from '../Components/Seller/BecomeSellerComponent';
import instance from '../Utils/Axios';
import UncontrolledSellerTableComponent from '../Components/Seller/UncontrolledSellerTableComponent';
import { getInventoryItems } from '../Utils/SellerUtility';

import './AccountPage.css'
import AccountPasswordComponent from '../Components/AccountPasswordComponent';
import Container from "@mui/material/Container";
import AccountReviewComponent from '../Components/AccountReviewComponent';

interface checkSellerResponse {
    isSeller:boolean;
};

const AccountPage:React.VFC = () => {

    const baseUser = {
        id : -1,
        email : "",
        firstname : "",
        lastname : "", 
        address : "", 
        balance : 0,
        zip  : 0,
        city : "",
        state : ""
    }

    const [user, setUser] = useState(baseUser)
    const [sellerStatus, setSellerStatus] = useState({ loaded: false, isSeller: false });
    const {currentUser, setCurrentUser} = useAuth()

    function updateSellerStatus(userId:number) {
        instance.get('/api/check_seller')
        .then((res) => {
            const responseData = res.data as checkSellerResponse;
            setSellerStatus({loaded: true, isSeller: responseData.isSeller});
        });
    }

    useEffect(() => {
        if (currentUser !== null) {
            setUser(currentUser);
            updateSellerStatus(currentUser.id);
        }
    }, [])

    return(<div className="accountPageContainer">   
        <NavbarComponent/>
        <AccountComponent user={user} setUser={setCurrentUser}/>
        <Container>
            <h2 style={{textAlign:"center"}}>Past Purchases</h2>
        </Container>
        <AccountPurchaseComponent/>
        <AccountReviewComponent/>
        {
            sellerStatus.loaded?
                sellerStatus.isSeller?
                    <div className="privateInventoryContainer">
                        <UncontrolledSellerTableComponent
                            mutable={false}
                            getInventoryItemsCallback={getInventoryItems(currentUser.id)}
                            title={`What I'm selling`}
                        />
                    </div> :
                    <BecomeSellerComponent/>
                : null
        }

    </div>)
}

export default protectedRoute(AccountPage);