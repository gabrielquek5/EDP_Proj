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
  Box
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import http from "../http";
import UserContext from "../contexts/UserContext";
import DeleteIcon from "@mui/icons-material/Delete";

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [rewardName, setRewardName] = useState(""); // State to store the applied reward name
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchCartItems();
    console.log(cartItems)


    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
      setOpenDialog(true);
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  const Message = ({ message }) => (
    <section>
      <p>{message}</p>
    </section>
  );




  const fetchCartItems = async () => {
    try {
      const id = user.id
      const res = await http.get(`/shoppingcart/${id}`);
      console.log("user",user) 
      const filteredCart = res.data.filter(
        (cart) => !cart.isDeleted
      )
      setCartItems(filteredCart);
      console.log(filteredCart);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleCheckout = async (cartArray) => {
    try {
      // Make the HTTP POST request to create a checkout session
      const checkoutResponse = await http.post("/shoppingcart/create-checkout-session");
      console.log(checkoutResponse);
      
      // Access the response data directly
      const checkoutData = checkoutResponse.data;
      
      // Check if the response contains the URL
      
      if (checkoutData && checkoutData.url) {
        console.log("Session URL:", checkoutData.url);
        window.location.href = checkoutData.url; // Redirect to Stripe Checkout
      } else {
        console.error("Session URL is undefined");
      }
  
    } catch (error) {
      console.error("Error during checkout and booking:", error);
    }
  };
  

  const deleteCartItem = async (id) => {
    try {
      await http.delete(`/shoppingcart/${id}`);
      fetchCartItems(); // Refresh cart items after deletion
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
            src={`${import.meta.env.VITE_FILE_BASE_URL}${
              cart.imageFile
            }`}
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
        <Box sx={{ border: "1px solid #808080", display: "inline-block" }} onClick={() => deleteCartItem(cart.itemID)}>
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
        <Grid item xs={12} md={4}>
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

            <Typography variant="h6" sx={{ marginBottom: 2, color: "green", mt: 3, fontFamily:"Poppins" }}>
              Reward Applied: {rewardName}
            </Typography>


            <Typography variant="h6" sx={{ marginBottom: 2, mt: 3, fontFamily:"Poppins" }}>
              Total: ${calculateSubtotal()}
            </Typography>
            
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
