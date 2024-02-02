import "./App.css";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import MyTheme from "./themes/MyTheme";
import MyForm from "./pages/MyForm";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Update from "./pages/Update.Jsx";
import Delete from "./pages/Delete";
import http from "./http";
import { useState, useEffect } from "react";
import Bookings from "./pages/Bookings";
import EditBooking from "./pages/EditBooking";
import ShoppingCart from "./pages/ShoppingCart";
import { MdOutlineShoppingCart } from "react-icons/md";
import AddReview from "./pages/AddReview";
import Reviews from "./pages/Reviews";
import EditReview from "./pages/EditReview";
import AdminReviews from "./pages/AdminReviews";
import Checkout from "./pages/Checkout";
import SuccessfulPayment from "./pages/SuccessfulPayment";
import UserContext from "./contexts/UserContext";
import Schedules from "./pages/Schedules";
import AddSchedule from "./pages/AddSchedule";
import EditSchedule from "./pages/EditSchedule";
import IndividualSchedules from "./pages/IndividualSchedules";
import ViewEvent from "./pages/ViewEvent";
import Rewards from './pages/Rewards';
import AddReward from './pages/AddReward';
import EditReward from './pages/EditReward';
import Notifications from './pages/Notifications';
import AddNotification from './pages/AddNotification';
import EditNotification from './pages/EditNotification';
import ViewNotifications from './pages/ViewNotifications';


function App() {
  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get("/user/auth").then((res) => {
        setUser(res.data.user);
        setLoading(false);
      });
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar
            position="static"
            sx={{ backgroundColor: "#FFA500", fontFamily: "Poppins" }}
            className="AppBar"
          >
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontFamily: "Poppins" }}
                  >
                    Uplay
                  </Typography>
                </Link>
                <Link to="/schedules">
                  <Typography>All Events</Typography>
                </Link>
                {user && (
                  <>
                    <Link to="/individualschedule">
                      <Typography>Your Schedules</Typography>
                    </Link>
                  </>
                )}
                <Box sx={{ flexGrow: 1 }}></Box>

                {user && (
                  <>
                    <Typography
                      style={{ marginRight: "8px", fontFamily: "Poppins" }}
                    >
                      {user.name}{" "}
                    </Typography>
                    <Link to="/Update">
                      <Typography>Update</Typography>
                    </Link>
                    <Link to="/Delete">
                      <Typography>Delete</Typography>
                    </Link>
                    <Link to="/bookings">
                      <Typography>Bookings</Typography>
                    </Link>
                    <Link to="/reviews">
                      <Typography>Reviews</Typography>
                    </Link>
                    <Link to="/rewards" ><Typography>Rewards</Typography></Link>

                    <Link to="/notifications" >
                      <Typography>Notifications</Typography>
                    </Link>
                    <Link to="/viewnotifications" >
                      <Typography>View Notifications</Typography>
                    </Link>
                    <Link to="/shoppingcart">
                      <Button>
                        <MdOutlineShoppingCart class="cart-btn" size={24} />
                      </Button>
                    </Link>
                    <Button onClick={logout}>Logout</Button>
                  </>
                )}
                {!user && (
                  <>
                    <Link to="/register">
                      <Typography style={{ fontFamily: "Poppins" }}>
                        Register
                      </Typography>
                    </Link>
                    <Link to="/login">
                      <Typography style={{ fontFamily: "Poppins" }}>
                        Login
                      </Typography>
                    </Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

          <Container>
            <Routes>
              <Route path={"/"} element={<Schedules />} />
              <Route path={"/form"} element={<MyForm />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/update"} element={<Update />} />
              <Route path={"/delete"} element={<Delete />} />
              <Route path={"/bookings"} element={<Bookings />} />
              <Route path={"/editbooking/:id"} element={<EditBooking />} />
              <Route path={"/form"} element={<MyForm />} />
              <Route path={"/shoppingcart"} element={<ShoppingCart />} />
              <Route path={"/addreview"} element={<AddReview />} />
              <Route path={"/reviews"} element={<Reviews />} />
              <Route path={"/editreview/:id"} element={<EditReview />} />
              <Route path={"/adminreviews"} element={<AdminReviews />} />
              <Route path={"/checkout"} element={<Checkout />} />
              <Route path={"/successfulpayment"} element={<SuccessfulPayment />}/>
              <Route path={"/addschedule"} element={<AddSchedule />} />
              <Route path={"/individualschedule"} element={<IndividualSchedules />}/>
              <Route path={"/editschedule/:id"} element={<EditSchedule />} />
              <Route path={"/schedules"} element={<Schedules />} />
              <Route path={"/viewevent/:id"} element={<ViewEvent />} />
              <Route path={"/rewards"} element={<Rewards />} />
              <Route path={"/addreward"} element={<AddReward />} />
              <Route path={"/editreward/:id"} element={<EditReward />} />
              <Route path={"/notifications"} element={<Notifications />} />
              <Route path={"/addnotification"} element={<AddNotification />} />
              <Route path={"/editnotification/:id"} element={<EditNotification />} />
              <Route path={"/viewnotifications"} element={<ViewNotifications />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
