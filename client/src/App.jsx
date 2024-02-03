import "./App.css";
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
import Rewards from "./pages/Rewards";
import AddReward from "./pages/AddReward";
import EditReward from "./pages/EditReward";
import Notifications from "./pages/Notifications";
import AddNotification from "./pages/AddNotification";
import EditNotification from "./pages/EditNotification";
import ViewNotifications from "./pages/ViewNotifications";
import uplayLogo from "./assets/logo_uplay.png";

function App() {
  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };
  const [loading, setLoading] = useState(true);
  const [dropMenu, setdropMenu] = useState(null);
  const [dropMenuNoti, setdropMenuNoti] = useState(null);
  const [dropMenuScheduling, setdropMenuScheduling] = useState(null);

  const [user, setUser] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get("/user/auth").then((res) => {
        setUser(res.data.user);
        setLoading(false);
      });
    }
  }, []);

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

  const handleSchedulingOpen = (event) => {
    setdropMenuScheduling(event.currentTarget);
  };

  const handleSchedulingClose = () => {
    setdropMenuScheduling(null);
  };

  return (
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
                  <Typography>All Experiences</Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }}></Box>

                {user && (
                  <>
                    <Button
                      onClick={handleSchedulingOpen}
                      variant="text"
                      sx={{ textTransform: "none", fontSize: "15px" }}
                    >
                      Scheduling
                    </Button>
                    <Menu
                      anchorEl={dropMenuScheduling}
                      open={Boolean(dropMenuScheduling)}
                      onClose={handleSchedulingClose}
                    >
                      <MenuItem
                        component={Link}
                        to="/individualschedule"
                        onClick={handleSchedulingClose}
                      >
                        My Schedules
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/bookings"
                        onClick={handleSchedulingClose}
                      >
                        My Bookings
                      </MenuItem>
                    </Menu>

                    <Button
                      onClick={handleNotiOpen}
                      variant="text"
                      sx={{ textTransform: "none", fontSize: "15px" }}
                    >
                      Notifications
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
                      >
                        View Notifications
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/notifications"
                        onClick={handleNotiClose}
                      >
                        Notifications
                      </MenuItem>
                    </Menu>

                    <Link to="/shoppingcart">
                      <Button>
                        <MdOutlineShoppingCart class="cart-btn" size={24} />
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
                        component={Link}
                        to="/Update"
                        onClick={handleMenuClose}
                      >
                        Update
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/Delete"
                        onClick={handleMenuClose}
                      >
                        Delete
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/reviews"
                        onClick={handleMenuClose}
                      >
                        My Reviews
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/rewards"
                        onClick={handleMenuClose}
                      >
                        My Rewards
                      </MenuItem>
                      <MenuItem>
                        <Button onClick={logout}>Logout</Button>
                      </MenuItem>
                    </Menu>
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
              <Route
                path={"/successfulpayment"}
                element={<SuccessfulPayment />}
              />
              <Route path={"/addschedule"} element={<AddSchedule />} />
              <Route
                path={"/individualschedule"}
                element={<IndividualSchedules />}
              />
              <Route path={"/editschedule/:id"} element={<EditSchedule />} />
              <Route path={"/schedules"} element={<Schedules />} />
              <Route path={"/viewevent/:id"} element={<ViewEvent />} />
              <Route path={"/rewards"} element={<Rewards />} />
              <Route path={"/addreward"} element={<AddReward />} />
              <Route path={"/editreward/:id"} element={<EditReward />} />
              <Route path={"/notifications"} element={<Notifications />} />
              <Route path={"/addnotification"} element={<AddNotification />} />
              <Route
                path={"/editnotification/:id"}
                element={<EditNotification />}
              />
              <Route
                path={"/viewnotifications"}
                element={<ViewNotifications />}
              />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
