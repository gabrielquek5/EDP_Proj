import React, {useEffect} from 'react';
import http from "../http";
import { Link } from 'react-router-dom'; // Assuming you're using React Router

function SuccessfulPayment() {
    useEffect(() => {
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
