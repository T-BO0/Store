import { useState } from "react";
import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";


function App() {
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
      <CssBaseline/>
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
      <Container>
        <Outlet/>
      </Container>
    </ThemeProvider>
  );
}

export default App;
