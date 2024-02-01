import './App.css';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Tutorials from './pages/Tutorials';
import AddTutorial from './pages/AddTutorial';
import EditTutorial from './pages/EditTutorial';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import Update from './pages/Update.Jsx';
import Delete from './pages/Delete';
import http from './http';
import {useState, useEffect} from 'react';
import Bookings from './pages/Bookings';
import AddBooking from './pages/AddBooking';
import EditBooking from './pages/EditBooking';
import ShoppingCart from './pages/ShoppingCart';
import { MdOutlineShoppingCart } from "react-icons/md";
import AddReview from './pages/AddReview';
import Reviews from './pages/Reviews';
import EditReview from './pages/EditReview';
import EventsPlaceholder from './pages/EventsPlaceholder';
import AdminReviews from './pages/AdminReviews';
import Checkout from './pages/Checkout';
import SuccessfulPayment from './pages/SuccessfulPayment';


function App() {

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  const [user, setUser] = useState(null);
useEffect(() => {
if (localStorage.getItem("accessToken")) {
  http.get("/user/auth").then((res) => setUser(res.data.user)); 
setUser({ name: 'User' });
}
}, []);
  return (
    <Router>
      <ThemeProvider theme={MyTheme}>
        <AppBar position="static" sx={{backgroundColor: "#FFA500", fontFamily: "Poppins"}} className="AppBar">
          <Container>
            <Toolbar disableGutters={true}>
              <Link to="/">
                <Typography variant="h6" component="div" sx={{fontFamily: "Poppins"}}>
                  Uplay
                </Typography>
              </Link>
              <Box sx={{ flexGrow: 1 }}></Box>

              {user && (
                <>
                  <Typography style={{marginRight:'8px', fontFamily: "Poppins"}}>{user.name}  </Typography>
                  <Link to="/Update">
                    <Typography>Update</Typography>
                  </Link>
                  <Link to="/Delete">
                    <Typography>Delete</Typography>
                  </Link>
                  <Link to="/bookings" ><Typography>Bookings</Typography></Link>
              <Link to="/reviews" ><Typography>Reviews</Typography></Link>
              <Link to="/eventsplaceholder" ><Typography>Events</Typography></Link>
              <Link to="/shoppingcart"><Button><MdOutlineShoppingCart class="cart-btn" size={24}/></Button></Link>
                  <Button onClick={logout}>Logout</Button>
                </>
              )}
              {!user && (
                <>
                  <Link to="/register">
                    <Typography style={{fontFamily: "Poppins"}}>Register</Typography>
                  </Link>
                  <Link to="/login">
                    <Typography style={{fontFamily: "Poppins"}}>Login</Typography>
                  </Link>
                </>
              )}
            </Toolbar>
          </Container>
        </AppBar>

        <Container>
          <Routes>
            <Route path={"/"} element={<Tutorials />} />
            <Route path={"/tutorials"} element={<Tutorials />} />
            <Route path={"/addtutorial"} element={<AddTutorial />} />
            <Route path={"/edittutorial/:id"} element={<EditTutorial />} />
            <Route path={"/form"} element={<MyForm />} />
            <Route path={"/register"} element={<Register />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/update"} element={<Update/>}  />
            <Route path={"/delete"} element={<Delete/>}  />
            <Route path={"/bookings"} element={<Bookings />} />
            <Route path={"/addbooking"} element={<AddBooking />} />
            <Route path={"/editbooking/:id"} element={<EditBooking />} />
            <Route path={"/form"} element={<MyForm />} />
            <Route path={"/shoppingcart"} element={<ShoppingCart />} />
            <Route path={"/addreview"} element={<AddReview/>}/>
            <Route path={"/reviews"} element={<Reviews/>}/>
            <Route path={"/editreview/:id"} element={<EditReview/>}/>
            <Route path={"/eventsplaceholder"} element={<EventsPlaceholder/>}/>
            <Route path={"/adminreviews"} element={<AdminReviews/>}/>
            <Route path={"/checkout"} element={<Checkout/>}/>
            <Route path={"/successfulpayment"} element={<SuccessfulPayment/>}/>
          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
