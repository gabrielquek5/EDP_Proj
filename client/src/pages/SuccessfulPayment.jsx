import React, {useEffect, useState} from 'react';
import http from "../http";
import { Link } from 'react-router-dom'; // Assuming you're using React Router

function SuccessfulPayment() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("running")
     fetchData();
}, []);



const fetchData = async () => {
  try {
      const response = await http.get("/shoppingcart");
      console.log("cartItems", response.data);

      // After setting the cart items, create bookings
      if (response.data && response.data.length > 0) {
          await createBooking(response.data);
          await deleteShoppingCart(response.data);
          setLoading(false);
      }
  } catch (error) {
      console.error('Error fetching cart items:', error);
      setLoading(false);
  }
};

const deleteShoppingCart = async (cartItems) => {
  try {
      if (!cartItems || cartItems.length === 0) {
          console.error("Error: cartItems is null or empty");
          return;
      }

      // Extract userId from the first cart item
      const userId = cartItems[0].userId;
      console.log("userId", userId);

      // Make a DELETE request to delete the shopping cart for the specified user
      await http.delete(`/shoppingcart/user/${userId}`);
      console.log('Shopping cart deleted successfully.');
  } catch (error) {
      console.error('Error deleting shopping cart:', error);
  }
};

      // const fetchCartItems = async () => {
      //   try {
      //     const response = await http.get("/shoppingcart");
      //     setCartItems(response.data);
      //     setLoading(false);
      //   } catch (error) {
      //     console.error("Error fetching cart items:", error);
      //   }
      // };
      
 const createBooking = async (cartItems) => {
    try {
        if (!cartItems || cartItems.length === 0) {
            console.error("Error: cartItems is null or empty");
            return;
        }

        // Loop through each item in cartItems array
        for (const cart of cartItems) {
          try {
              console.log("cartItems in create booking", cartItems);
              const id = cart.scheduleId;
              console.log("id", id);
              
              // Fetch event details including price
              const eventResponse = await http.get(`/Schedule/${id}`);
              const eventData = eventResponse.data;
              console.log(eventData);
              
              // Extract price from event details
              const eventName = eventData.title;
              const eventPrice = eventData.price;
              const eventDate = eventData.selectedDate;
              const scheduleId = eventData.scheduleId;
      
              // Create the booking data object with the appropriate values
              const bookingData = {
                  bookingDate: cart.cartSelectedDate,
                  bookingTime: cart.cartSelectedTime, // Assuming DateCart is correct
                  pax: cart.quantity,
                  price: eventPrice, // Set the price from the event
                  bookingTitle: eventName,
                  ScheduleId: scheduleId,
              };
              console.log("bookingdata", bookingData);
      
              // Make the HTTP POST request to create a booking
              const bookingResponse = await http.post(`/bookings/${id}`, bookingData);
      
              console.log("Booking created:", bookingResponse.data);
          } catch (error) {
              console.error("Error processing cart item:", error);
          }
      }
      
      
    } catch (error) {
        console.error("Error during checkout and booking:", error);
    }
};
    
    
    

  const containerStyle = {
    textAlign: 'center',
    marginTop: '50px',
  };

  const headingStyle = {
    fontSize: '24px',
    color: 'primary',
  };

  const paragraphStyle = {
    fontSize: '18px',
    color: '#333',
    marginBottom: '20px',
  };

  const linkStyle = {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  };

  const linkHoverStyle = {
    backgroundColor: '#0056b3',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Payment Successful!</h2>

      <p style={paragraphStyle}>Thank you for your payment.</p>
      <Link to="/" style={linkStyle} onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'} onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}>
        Back to Home
      </Link>
    </div>
  );
}

export default SuccessfulPayment;
