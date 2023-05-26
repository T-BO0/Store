import LoadingComponent from "../../app/layout/LoadComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import {setPageNumber,setProductsParams,} from "./catalogSlice";
import {Grid, Paper} from "@mui/material";
import ProductSearch from "./Productsearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import AppPagination from "../../app/components/AppPagination";
import useProducts from "../../app/hooks/useProducts";


const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price - High to low" },
  { value: "price", label: "Price - Low to high" },
];


export default function Catalog() {
  const {products, brands, types, filtersLoaded, metaData} = useProducts();
  const { productParam } = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();


  if (!filtersLoaded)
    return <LoadingComponent message="Loading products..." />;

  return (
    <Grid container columnSpacing={4}>
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
      <Grid item xs={9} sx={{mb:2}}>
        {metaData &&
        <AppPagination
          metaData={metaData}
          onPageChange={(page:number) => dispatch(setPageNumber({pageNumber: page}))}
        />
        }
      </Grid>
    </Grid>
  );
}
