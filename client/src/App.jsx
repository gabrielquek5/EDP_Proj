import "./App.css";
import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import MyTheme from "./themes/MyTheme";
import MyForm from "./pages/MyForm";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Update from "./pages/Update.Jsx";
import Delete from "./pages/Delete";
import http from "./http";
import Bookings from "./pages/Bookings";
import EditBooking from "./pages/EditBooking";
import ShoppingCart from "./pages/ShoppingCart";
import { MdOutlineShoppingCart } from "react-icons/md";
import AddReview from "./pages/AddReview";
import Reviews from "./pages/Reviews";
import EditReview from "./pages/EditReview";
import AdminReviews from "./pages/AdminReviews";
import AdminBookings from "./pages/AdminBookings";
import Checkout from "./pages/Checkout";
import SuccessfulPayment from "./pages/SuccessfulPayment";
import UserContext from "./contexts/UserContext";
import Schedules from "./pages/Schedules";
import AddSchedule from "./pages/AddSchedule";
import EditSchedule from "./pages/EditSchedule";
import IndividualSchedules from "./pages/IndividualSchedules";
import ViewEvent from "./pages/ViewEvent";
import Rewards from "./pages/Rewards";
import AddReward from "./pages/AddReward";
import EditReward from "./pages/EditReward";
import ViewRewards from './pages/ViewRewards';
import Notifications from "./pages/Notifications";
import AddNotification from "./pages/AddNotification";
import EditNotification from "./pages/EditNotification";
import ViewNotifications from "./pages/ViewNotifications";
import HomePage from "./pages/HomePage";
import AdminPanel from "./pages/AdminPanel";
import uplayLogo from "./assets/logo_uplay.png";
import NotFound from "./pages/NotFound";
import Footer from "./pages/Footer";
import { useUserData } from "../src/pages/Components/userData";

function App() {
  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };
  const [loading, setLoading] = useState(true);
  const [dropMenu, setdropMenu] = useState(null);
  const [dropMenuNoti, setdropMenuNoti] = useState(null);
  const [dropMenuReward, setdropMenuReward] = useState(null); // Added state for reward menu
  const [dropMenuScheduling, setdropMenuScheduling] = useState(null);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const { userData, setUserDataCookie } = useUserData();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      http
        .get("/user/auth")
        .then((res) => {
          setUser(res.data.user);
          setLoading(false);
          // Move the call to fetchCartItems here
          setUserDataCookie(res.data.user);
          fetchCartItems(res.data.user.id);
        })
        .catch((error) => {
          console.error("Authentication failed:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);
  
  const fetchCartItems = async (userId) => {
    try {
      const res = await http.get(`/shoppingcart/${userId}`);
      const filteredCart = res.data.filter((cart) => !cart.isDeleted);
      setCartItems(filteredCart);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };
  

  const handleMenuOpen = (event) => {
    setdropMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setdropMenu(null);
  };

  const handleNotiOpen = (event) => {
    setdropMenuNoti(event.currentTarget);
  };

  const handleNotiClose = () => {
    setdropMenuNoti(null);
  };

  const handleRewardOpen = (event) => {
    setdropMenuReward(event.currentTarget);
  };

  const handleRewardClose = () => {
    setdropMenuReward(null);
  };

  const handleSchedulingOpen = (event) => {
    setdropMenuScheduling(event.currentTarget);
  };

  const handleSchedulingClose = () => {
    setdropMenuScheduling(null);
  };

  return (
    <Box
      className="page-container"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Box className="content-wrap" sx={{ flex: 1 }}>
        <UserContext.Provider value={{ user, setUser }}>
          <Router>
            <ThemeProvider theme={MyTheme}>
              <AppBar
                position="static"
                elevation={0}
                sx={{
                  backgroundColor: "white",
                  fontFamily: "Poppins",
                  color: "black",
                  boxShadow: "none",
                }}
                className="AppBar"
              >
                <Container>
                  <Toolbar disableGutters={true}>
                    <Link to="/">
                      <img
                        src={uplayLogo}
                        alt="Uplay Logo"
                        style={{ height: "40px", marginRight: "16px" }}
                      />
                    </Link>
                    <Link to="/schedules">
                      <Typography fontFamily="Poppins" fontWeight="bold">
                        All Experiences
                      </Typography>
                    </Link>
                    <Box sx={{ flexGrow: 1 }}></Box>

                    {user && (
                      <>
                        <Button
                          onClick={handleSchedulingOpen}
                          variant="text"
                          sx={{ textTransform: "none", fontSize: "15px",fontFamily:"Poppins", fontWeight:"bold", mr:5  }}
                        >
                          Events and Bookings
                        </Button>
                        <Menu
                          anchorEl={dropMenuScheduling}
                          open={Boolean(dropMenuScheduling)}
                          onClose={handleSchedulingClose}
                        >
                          <MenuItem
                            sx={{fontFamily:"Poppins"}}
                            component={Link}
                            to="/individualschedule"
                            onClick={handleSchedulingClose}
                          >
                            My Events
                          </MenuItem>
                          <MenuItem
                          sx={{fontFamily:"Poppins"}}
                          fontFamily="Poppins" 
                            component={Link}
                            to="/bookings"
                            onClick={handleSchedulingClose}
                          >
                            My Bookings
                          </MenuItem>
                        </Menu>

                        <Link to="/reviews">
                          <Typography fontFamily="Poppins" fontWeight="bold">Reviews</Typography>
                        </Link>

                        <Button onClick={handleNotiOpen}>
                          <NotificationsNoneOutlinedIcon />
                        </Button>
                        <Menu
                          anchorEl={dropMenuNoti}
                          open={Boolean(dropMenuNoti)}
                          onClose={handleNotiClose}
                        >
                          <MenuItem
                            component={Link}
                            to="/viewnotifications"
                            onClick={handleNotiClose}
                            sx={{fontFamily:"Poppins"}}
                          >
                            View Notifications
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/notifications"
                            onClick={handleNotiClose}
                            sx={{fontFamily:"Poppins"}}
                          >
                            Notifications
                          </MenuItem>
                        </Menu>

                        <Button onClick={handleRewardOpen}>
                          <CardGiftcardOutlinedIcon />
                        </Button>
                        <Menu
                          anchorEl={dropMenuReward} 
                          open={Boolean(dropMenuReward)}
                          onClose={handleRewardClose}
                        >
                          <MenuItem
                            component={Link}
                            to="/viewrewards"
                            onClick={handleRewardClose}
                            sx={{fontFamily:"Poppins"}}
                          >
                            View Rewards
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/rewards"
                            onClick={handleRewardClose}
                            sx={{fontFamily:"Poppins"}}
                          >
                            Rewards
                          </MenuItem>
                        </Menu>

                        <Link to="/shoppingcart">
                          <Button>
                            <MdOutlineShoppingCart size={24} />

                          </Button>
                        </Link>
                        <Button onClick={handleMenuOpen}>
                          <AccountCircleIcon />
                        </Button>
                        <Menu
                          anchorEl={dropMenu}
                          open={Boolean(dropMenu)}
                          onClose={handleMenuClose}
                        >
                          <MenuItem
                            sx={{fontFamily:"Poppins", color:"Blue", fontSize:18}}
                          >
                            {user.name} {user.lastname}
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/Update"
                            onClick={handleMenuClose}
                            sx={{fontFamily:"Poppins"}}
                          >
                            Update
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/Delete"
                            onClick={handleMenuClose}
                            sx={{fontFamily:"Poppins"}}
                          >
                            Delete
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/adminpanel"
                            onClick={handleMenuClose}
                            sx={{fontFamily:"Poppins"}}
                          >
                            Admin Panel
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/reviews"
                            onClick={handleMenuClose}
                            sx={{fontFamily:"Poppins"}} 
                          >
                            My Reviews
                          </MenuItem>
  
                          <MenuItem sx={{fontFamily:"Poppins", color:"red"}} onClick={logout}>
                          Logout
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                    {!user && (
                      <>
                        <Link to="/register">
                          <Typography fontFamily="Poppins">
                            Register
                          </Typography>
                        </Link>
                        <Link to="/login">
                          <Typography fontFamily="Poppins">
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
                  <Route path={"/"} element={<HomePage />} />
                  <Route path={"/form"} element={<MyForm />} />
                  <Route path={"/register"} element={<Register />} />
                  <Route path={"/login"} element={<Login />} />
                  <Route path={"/update"} element={<Update />} />
                  <Route path={"/delete"} element={<Delete />} />
                  <Route path={"/bookings"} element={<Bookings />} />
                  <Route path={"/editbooking/:id"} element={<EditBooking />} />
                  <Route path={"/form"} element={<MyForm />} />
                  <Route path={"/shoppingcart"} element={<ShoppingCart />} />
                  <Route path={"/addreview/:id"} element={<AddReview />} />
                  <Route path={"/reviews"} element={<Reviews />} />
                  <Route path={"/editreview/:id"} element={<EditReview />} />
                  <Route path={"/adminreviews"} element={<AdminReviews />} />
                  <Route path={"/checkout"} element={<Checkout />} />
                  <Route
                    path={"/successfulpayment"}
                    element={<SuccessfulPayment />}
                  />
                  {user && (
                    <Route path={"/addschedule"} element={<AddSchedule />} />
                  )}
                  <Route
                    path={"/individualschedule"}
                    element={<IndividualSchedules />}
                  />
                  <Route
                    path={"/editschedule/:id"}
                    element={<EditSchedule />}
                  />
                  <Route path={"/schedules"} element={<Schedules />} />
                  <Route path={"/adminschedules"} />
                  <Route path={"/viewevent/:id"} element={<ViewEvent onItemAddedToCart={fetchCartItems} />} />
                  <Route path={"/rewards"} element={<Rewards />} />
                  <Route path={"/addreward"} element={<AddReward />} />
                  <Route path={"/editreward/:id"} element={<EditReward />} />
                  <Route path={"/viewrewards"} element={<ViewRewards />} />
                  <Route path={"/notifications"} element={<Notifications />} />
                  <Route
                    path={"/addnotification"}
                    element={<AddNotification />}
                  />s
                  <Route
                    path={"/editnotification/:id"}
                    element={<EditNotification />}
                  />
                  <Route
                    path={"/viewnotifications"}
                    element={<ViewNotifications />}
                  />
                  <Route path={"/adminpanel"} element={<AdminPanel />} />
                  <Route path={"*"} element={<NotFound />} />
                </Routes>
              </Container>
            </ThemeProvider>
          </Router>
        </UserContext.Provider>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
