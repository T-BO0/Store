import LoadingComponent from "../../app/layout/LoadComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import { useEffect } from "react";
import {
  fetchFilters,
  fetchProductsAsync,
  productSelectors,
  setProductsParams,
} from "./catalogSlice";
import {
  Box,
  Grid,
  Pagination,
  Paper,
  Typography,
} from "@mui/material";
import ProductSearch from "./Productsearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButtons from "../../app/components/CheckboxButtons";


const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price - High to low" },
  { value: "price", label: "Price - Low to high" },
];


//comp
export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const { productsLoaded, status, filtersLoaded, brands, types, productParam } = useAppSelector(
    (state) => state.catalog
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [dispatch, productsLoaded]);

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFilters());
  }, [dispatch, filtersLoaded]);

  if (status.includes("pending"))
    return <LoadingComponent message="Loading products..." />;
  return (
    <Grid container spacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch/>
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButtonGroup
            selectedValue={productParam.orderBy}
            options={sortOptions}
            onChange={(e) => dispatch(setProductsParams({orderBy: e.target.value}))}
          />
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
            items={brands}
            checked={productParam.brands}
            onChange={(items: string[]) => dispatch(setProductsParams({brands: items}))}
          />
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
              items={types}
              checked={productParam.types}
              onChange={(items: string[]) => dispatch(setProductsParams({types: items}))}
            />
        </Paper>

      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3}/>
      <Grid item xs={9}>
        <Box display='flex' justifyContent='space-between' alignItems='center' >
            <Typography>Displying 1-6 of 20 items</Typography>
            <Pagination
                color="secondary"
                size="large"
                count={10}
                page={1}
            />
        </Box>
      </Grid>
    </Grid>
  );
}
