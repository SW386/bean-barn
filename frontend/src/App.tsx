import React, {useEffect, useState} from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import AccountPage from './Pages/AccountPage';
import CartPage from './Pages/CartPage';
import ProductPage from './Pages/ProductPage';
import SellerInventoryPage from './Pages/SellerInventoryPage';
import HomePage from './Pages/HomePage';
import EachPage from './Pages/EachPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import OrdersPage from './Pages/OrdersPage';
import DetailedOrderPage from './Pages/DetailedOrderPage';
import { useAuth } from './Context/UserContext';
import instance from './Utils/Axios';
import SellerPurchasesPage from './Pages/SellerPurchasesPage';
import PublicPage from './Pages/PublicPage';

function App() {

  const {currentUser, setCurrentUser} = useAuth()
  const [loading, setLoading] = useState(true)

  const checkAuthState = async () => {
    if (currentUser !== null) return
    await instance.get('/api/validate').then(
      () => {
        if (currentUser === null) {
          instance.get('/api/userdata').then((response) => {
            const data = Object.assign({}, response.data)
            if ("user" in data) {
              console.log("We have set the current user to not null")
              setCurrentUser(data["user"])
            }
          }).catch((err)=>(console.log(err)))
        }
      }
    ).catch(
      (err) => {
        console.log(err)
        setCurrentUser(null)
      }
    )
  }

  useEffect(() => {

    const performStartup = async () => {
      await checkAuthState()
      setTimeout(() => {
        setLoading(false)
      }, 100)
    }
    performStartup()
  
  })

  if (loading) {
    return <div/>
  } else {
    return (
      <Router>
        <Switch>
          <Route path="/account">
            <AccountPage/>
          </Route>
          <Route path="/cart">
            <CartPage/>
          </Route>
          <Route path="/product">
            <ProductPage/>
          </Route>
          <Route path="/seller_inventory">
            <SellerInventoryPage/>
          </Route>
          <Route path="/seller_purchases">
            <SellerPurchasesPage/>
          </Route>
          <Route path="/login">
            <LoginPage/>
          </Route>
          <Route path="/register">
            <RegisterPage/>
          </Route>
          <Route path="/EachPage/:id">
            <EachPage/>
          </Route>
          <Route path="/public/:email">
            <PublicPage/>
          </Route>
          <Route path="/user_orders">
            <OrdersPage/>
          </Route>
          <Route path="/detailed_user_order/:orderId">
              <DetailedOrderPage />
          </Route>
          <Route path="/">
            <HomePage/>
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App;
