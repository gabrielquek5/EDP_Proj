import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import http from "../http";
import DeleteIcon from "@mui/icons-material/Delete";

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCartItems();

    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
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
      const response = await http.get("/shoppingcart");
      setCartItems(response.data);
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
  
      // Assuming you have the event ID from the shopping cart
      const eventId = 1; // Adjust as per your data structure
  
      // Extracting the first element of the cartArray
      const cart = cartArray[0];
  
      // Fetch event details including price
      const eventResponse = await http.get(`/eventcontrollerplaceholder/${eventId}`);
      const eventData = eventResponse.data;
  
      // Extract price from event details
      const eventPrice = eventData.eventPrice;
      const dateCart = cart.dateCart;
  
      // Create the booking data object with the appropriate values
      const bookingData = {
        bookingDate: dateCart, // Assuming DateCart is correct
        pax: cart.quantity,
        price: eventPrice // Set the price from the event
      };
      console.log(bookingData)
  
      // Make the HTTP POST request to create a booking
      const bookingResponse = await http.post("/bookings", bookingData);
  
      console.log("Booking created:", bookingResponse.data);
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


  return (
    <Container maxWidth="lg" sx={{ background: "#f0f0f0", minHeight: "100vh", paddingY: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
        <Message message={message} />
          <Paper elevation={3} sx={{ padding: 3, background: "white" }}>
            <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>
              MY CART
            </Typography>
            <hr />
            <List>
              {cartItems.map((cart) => (
                <React.Fragment key={cart.itemID}>
                  <ListItem>
                    <ListItemText
                      primary={cart.eventName}
                      secondary={`Price: $${cart.eventPrice} | Quantity: ${cart.quantity}`}
                    />
                    <IconButton variant="outlined" color="error" onClick={() => deleteCartItem(cart.itemID)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
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

            <Typography variant="h6" sx={{ marginBottom: 2, mt: 3 }}>
              Total: ${calculateSubtotal()}
            </Typography>
            
            <Button onClick={() => handleCheckout(cartItems)} variant="contained" color="primary">
            CHECKOUT
          </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ShoppingCart;
