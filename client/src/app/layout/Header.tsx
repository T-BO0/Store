import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import SignInMenu from "./SignedInMenu";
const midLinks = [
    {title: 'catalog', path:'/catalog'},
    {title: 'about', path:'/about'},
    {title: 'contact', path:'/contact'},
];

const rightLinks = [
    {title: 'login', path:'/login'},
    {title: 'register', path:'/register'},
];

interface Props{
    darkMode: boolean;
    handleThemeChange: ()=>void;
}

const navStyles = {
    color: "inherit", 
    typography: "h6",
    textDecoration: "none",
    '&:hover':{
        color: 'grey.500'
    },
    '&.active':{
        color: 'text.secondary'
    }
}
export default function Header({darkMode, handleThemeChange}:Props){
    const {basket} = useAppSelector(state => state.basket);
    const {user} = useAppSelector(state => state.account);
    const itemCount = basket?.items.reduce((sum, item) => sum+item.quantity, 0);

    return(
        <AppBar position="static">
            <Toolbar sx={{display:'flex', justifyContent:'space-between'}}>

                <Box display = 'flex' alignItems='center'>
                    <Typography variant='h6' component={NavLink} 
                        to="/"
                        sx={navStyles}
                    >
                        RE-STORE
                    </Typography>
                    <Switch checked = {darkMode} onChange={handleThemeChange}/>
                </Box>
                

                <List sx={{display: "flex"}}>
                    {midLinks.map(({title,path})=>(
                        <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navStyles}
                        >
                            {title}
                        </ListItem>
                    ))}
                </List>

                <Box display='flex' alignItems='center'>
                    <IconButton component={Link} to='/basket' size="large" edge='start' color="inherit" sx={{mr:2}}>
                            <Badge badgeContent={itemCount} color="secondary">
                                <ShoppingCart />
                            </Badge>
                    </IconButton>
                    {user? (
                        <SignInMenu/>
                    ): (
                        <List sx={{display: "flex"}}>
                            {rightLinks.map(({title,path})=>(
                                <ListItem
                                    component={NavLink}
                                    to={path}
                                    key={path}
                                    sx={navStyles}
                                >
                                    {title}
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
                
            </Toolbar>
        </AppBar>
    )
}