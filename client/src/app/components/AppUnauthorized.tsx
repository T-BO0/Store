import { Typography, Button } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function AppUnauthorized(){
    return(
        <>
                <Typography variant="h4">sorry you are not outhorized</Typography>
                <Button 
                    component={NavLink}
                    to={'/catalog'}
                >
                    Back To Catalog
                </Button>
            </>
    )
}