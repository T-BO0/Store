import { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadingComponent from "./LoadComponent";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../../features/Basket/basketSlice";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import HomePage from "../../features/homme/HomePage";


function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true)

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch (error) {
      console.log(error);
    }
  },[dispatch]);

  useEffect(()=>{
    initApp().then(() => setLoading(false))
  },[initApp])

  const [darkMode, setTheme] = useState(false);
  const paletteType = darkMode? 'dark' : 'light'
  const theme = createTheme({
    palette:{
      mode: paletteType,
      background : {
        default: paletteType === 'light' ? '#eaeaea' : '#121212',
      },
    }
  });
  function handleThemeChange(){
    setTheme(!darkMode)
  }


  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored"/>
      <CssBaseline/>
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
      {loading ? <LoadingComponent message="Loading Basket..."/>
        : location.pathname === '/' ? <HomePage/>
        : <Container sx={{mt:4}}>
            <Outlet/>
          </Container>
      }
    </ThemeProvider>
  );
}

export default App;
