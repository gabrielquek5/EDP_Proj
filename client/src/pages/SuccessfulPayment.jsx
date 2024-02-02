import React, {useEffect} from 'react';
import http from "../http";
import { Link } from 'react-router-dom'; // Assuming you're using React Router

function SuccessfulPayment() {
    useEffect(() => {
      fetchCartItems();
        createBooking();
        deleteShoppingCart();
      }, []); // Run only once when the component mounts
    
      const deleteShoppingCart = async () => {
        try {
          // Make a DELETE request to delete the shopping cart
          await http.delete(`/shoppingcart/${1}`);
          console.log('Shopping cart deleted successfully.');
        } catch (error) {
          console.error('Error deleting shopping cart:', error);
        }
      };

      const fetchCartItems = async () => {
        try {
          const response = await http.get("/shoppingcart");
          setCartItems(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      };

      const createBooking = async (cartArray) =>{

        try{
       // Assuming you have the event ID from the shopping cart
      const id = 3; // Adjust as per your data structure
  
      // Extracting the first element of the cartArray
      const cart = cartArray[0];
  
      // Fetch event details including price
      const eventResponse = await http.get(`/Schedule/${id}`);
      const eventData = eventResponse.data;
      console.log(eventData);
      // Extract price from event details
      const eventName = eventData.title
      const eventPrice = eventData.price;
      const eventDate = eventData.selectedDate
  
      // Create the booking data object with the appropriate values
      const bookingData = {
        bookingDate: eventDate, // Assuming DateCart is correct
        pax: cart.quantity,
        price: eventPrice, // Set the price from the event
        bookingTitle: eventName,
        ScheduleId: id
      };
      console.log(bookingData)
  
      // Make the HTTP POST request to create a booking
      const bookingResponse = await http.post(`/bookings/${id}`, bookingData);
  
      console.log("Booking created:", bookingResponse.data);

    } catch (error) {
      console.error("Error during checkout and booking:", error);
    }
      }

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
