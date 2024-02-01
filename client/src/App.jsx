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
        <AppBar position="static" sx={{backgroundColor: "#FFA500", fontFamily: "cursive"}} className="AppBar">
          <Container>
            <Toolbar disableGutters={true}>
              <Link to="/">
                <Typography variant="h6" component="div" sx={{fontFamily: "cursive"}}>
                  Uplay
                </Typography>
              </Link>
              <Box sx={{ flexGrow: 1 }}></Box>

              {user && (
                <>
                  <Typography style={{marginRight:'8px', fontFamily: "cursive"}}>{user.name}  </Typography>
                  <Link to="/Update">
                    <Typography>Update</Typography>
                  </Link>
                  <Link to="/Delete">
                    <Typography>Delete</Typography>
                  </Link>
                  <Button onClick={logout}>Logout</Button>
                </>
              )}
              {!user && (
                <>
                  <Link to="/register">
                    <Typography style={{fontFamily: "cursive"}}>Register</Typography>
                  </Link>
                  <Link to="/login">
                    <Typography style={{fontFamily: "cursive"}}>Login</Typography>
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
          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
