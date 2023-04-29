import TextField from "@mui/material/TextField/TextField";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductsParams } from "./catalogSlice";
import { useState } from "react";
import { debounce } from "@mui/material";

export default function ProductSearch(){
    const {productParam} = useAppSelector(state => state.catalog);
    const [searchTerm, setSearchTerm] = useState(productParam.searchTerm);
    const dispatch = useAppDispatch();

    const debouncedSearch = debounce((event:any) => {
        dispatch(setProductsParams({searchTerm: event.target.value}));
    }, 1000);

    return(
        <TextField 
            label="Search products" 
            variant="outlined" 
            fullWidth
            value={searchTerm || ''}
            onChange={(event:any) => {
                setSearchTerm(event.target.value);
                debouncedSearch(event);
            }}
        />
    )
}