import { useEffect, useState } from "react";
import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useStoreContext } from "../context/StoreContext";
import { getCookie } from "../util/util";
import agent from "../api/agent";
import LoadingComponent from "./LoadComponent";
import { useAppDispatch } from "../store/configureStore";
import { setBasket } from "../../features/Basket/basketSlice";


function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const buyerId = getCookie("buyerId");
    if(buyerId){
      agent.Basket.get()
        .then(basket => dispatch(setBasket(basket)))
        .catch(error => console.log(error))
        .finally(()=>setLoading(false));
    } else {
      setLoading(false);
    }
  },[dispatch])

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

  if(loading) return <LoadingComponent message="Loading Basket..."/>

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored"/>
      <CssBaseline/>
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
      <Container>
        <Outlet/>
      </Container>
    </ThemeProvider>
  );
}

export default App;
