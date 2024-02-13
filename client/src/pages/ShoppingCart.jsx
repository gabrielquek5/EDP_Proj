import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Box,
  TextField // Import TextField component
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import http from "../http";
import UserContext from "../contexts/UserContext";
import { useUserData } from "./Components/userData";

function ShoppingCart({ rewardCode }) { // Receive rewardCode as a prop
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [rewardName, setRewardName] = useState(""); // State to store the applied reward name
  const [openDialog, setOpenDialog] = useState(false);
  const { userData, setUserDataCookie } = useUserData();
  const [couponCode, setCouponCode] = useState(""); // State to store the coupon code
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message
  const [total, setTotal] = useState(0); // State to store the total amount
  const [totalCoupon, setTotalCoupon] = useState(0); // State to store the total amount after applying coupon
  const [rewardList, setRewardList] = useState([]);

  useEffect(() => { 
    getRewards();
    if (userData && userData.id) {
      console.log("User data found. Fetching cart items...");
      fetchCartItems(userData.id);
    } else {
      console.log("User data not found. Skipping cart item fetching.");
    }
  }, [userData]);
  
  const Message = ({ message }) => (
    <section>
      <p>{message}</p>
    </section>
  );
  
  const getRewards = () => {
    http.get('/reward').then((res) => {
        setRewardList(res.data);
         
    });
};

  const fetchCartItems = async (userId) => {
    try {
      console.log("Fetching cart items for user ID:", userId); // Log the user ID
      const res = await http.get(`/shoppingcart/${userId}`);
      console.log("Response from shopping cart API:", res.data); // Log the response data
      const filteredCart = res.data.filter((cart) => !cart.isDeleted);
      console.log("Filtered cart items:", filteredCart); // Log the filtered cart items
      setCartItems(filteredCart);
      setLoading(false);
      // Calculate and set the initial total amount
      const initialTotal = calculateSubtotal();
      setTotal(initialTotal);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };
  
  const handleCheckout = async (cartArray) => {
    try {
        // Prepare the data to be sent to the backend, including the coupon code
        const checkoutData = {
            cart: cartArray,
            couponCode: couponCode  // Assuming couponCode is the state containing the coupon code
        };

        // Make the HTTP POST request to create a checkout session
        const checkoutResponse = await http.post("/shoppingcart/create-checkout-session", checkoutData);
        
        // Access the response data directly
        const responseData = checkoutResponse.data;
        
        // Check if the response contains the URL
        if (responseData && responseData.url) {
            console.log("Session URL:", responseData.url);
            window.location.href = responseData.url; // Redirect to Stripe Checkout
        } else {
            console.error("Session URL is undefined");
        }
    } catch (error) {
        console.error("Error during checkout and booking:", error);
    }
};
  
  const deleteCartItem = async (itemId,userId) => {
    try {
      await http.delete(`/shoppingcart/${itemId}`);
      fetchCartItems(userId); // Refresh cart items after deletion
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    }
  };

  const calculateSubtotal = () => {
    return cartItems
      .reduce((total, cart) => total + cart.eventPrice * cart.quantity, 0)
      .toFixed(2);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const applyCouponCode = () => {
    if (couponCode === rewardList[0].code) { // Check if the entered coupon code matches reward code
      setRewardName(` ${couponCode}`);
      setErrorMessage("");
      // Calculate the total amount after applying the coupon
      const subtotal = calculateSubtotal();
      const discount = 10 ; // calculate the discount based on the coupon code
      const totalWithCoupon = subtotal - (subtotal / discount)
      setTotalCoupon(totalWithCoupon.toFixed(2)); // Set the totalCoupon state
    } else {
      setErrorMessage("Invalid coupon code");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ background: "#00000", minHeight: "100vh", paddingY: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Message message={message} />
          <Paper elevation={3} sx={{ padding: 3, background: "white" }}>
            <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>
              MY CART
            </Typography>
            <hr />  
            <List>
              {cartItems
                .filter((cart) => !user || user.id === cart.userId)
                .map((cart) => (
                  <React.Fragment key={cart.itemID}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <img
                          height="150px"
                          width="auto"
                          alt="event_image"
                          src={`${import.meta.env.VITE_FILE_BASE_URL}${cart.imageFile}`}
                        ></img>
                      </div>
                      <div>
                        <Typography variant="h6" sx={{ fontFamily: "Poppins", mb:1 }}>
                          {cart.eventName}
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: "Poppins", mb:1 }}>
                          Price: ${cart.eventPrice}
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: "Poppins" }}>
                          Quantity: {cart.quantity}
                        </Typography>
                      </div>
                      <Box sx={{ border: "1px solid #808080", display: "inline-block" }} onClick={() => deleteCartItem(cart.itemID, user.id)}>
                        <IconButton color="error">
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    </div>
                    {/* Divider */}
                    <Divider />
                  </React.Fragment>
                ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} mt={2}>
          <Paper elevation={3} sx={{ padding: 3, background: "white" }}>
            <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>
              TOTAL
            </Typography>
            <hr />
            {rewardName && (
              <Typography variant="h6" sx={{ marginBottom: 2, color: "green", mt: 3, fontFamily:"Poppins" }}>
                Reward Applied: {rewardName}
              </Typography>
            )}

            {/* Add TextField for coupon code */}
            <Box sx={{ marginBottom: 2 }}>
              <TextField
                label="Coupon Code"
                variant="outlined"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                sx={{ marginBottom: 2, width: '100%' }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={applyCouponCode}
                sx={{ width: '100%', fontFamily: 'Poppins' }}
              >
                Apply
              </Button>
              {errorMessage && (
                <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
                  {errorMessage}
                </Typography>
              )}
            </Box>

            {/* Display total amount */}
            <Typography variant="h6" sx={{ marginBottom: 2, mt: 3, fontFamily:"Poppins" }}>
              Total: ${calculateSubtotal()}
            </Typography>

            {/* Display total amount after applying coupon */}
            {totalCoupon > 0 && (
              <Typography variant="h6" sx={{ marginBottom: 2, mt: 3, fontFamily:"Poppins" }}>
                Total with Coupon: ${totalCoupon}
              </Typography>
            )}
            
            <Button onClick={async() => handleCheckout(cartItems)} variant="contained" color="primary" fontFamily="Poppins">
              CHECKOUT
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Redemption Successful Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Redemption Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your reward has been applied!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ShoppingCart;
