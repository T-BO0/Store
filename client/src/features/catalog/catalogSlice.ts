import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootStore } from "../../app/store/configureStore";

interface CatalogState{
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParam: ProductParams;
}

const productsAdapter = createEntityAdapter<Product>();

function getAxionsParams(productParams: ProductParams){
    const params = new URLSearchParams();
    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());
    params.append('orderBy', productParams.orderBy);
    if(productParams.searchTerm) params.append('searchTerm', productParams.searchTerm);
    if(productParams.brands) params.append('brands', productParams.brands.toString());
    if(productParams.types) params.append('types', productParams.types.toString());

    return params;
}

export const fetchProductsAsync = createAsyncThunk<Product[], void, {state:RootStore}>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => {
        const params = getAxionsParams(thunkAPI.getState().catalog.productParam)
        try {
            return await agent.Catalog.list(params);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
);

export const fetchProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductAsync',
    async (productId, thunkAPI) => {
        try {
            return await agent.Catalog.details(productId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
);

export const fetchFilters = createAsyncThunk(
    'catalog/fetchFilters',
    async (_, thunkAPI) => {
        try {
            return agent.Catalog.filters();
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

function initParams(){
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: 'name',
    }
}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState<CatalogState>({
        filtersLoaded: false,
        productsLoaded: false,
        status: 'idle',
        brands: [],
        types: [],
        productParam: initParams(),
    }),
    reducers: {
        setProductsParams: (state, action) => {
            state.productsLoaded = false;
            state.productParam = {...state.productParam, ...action.payload};
        },
        resetProductParams: (state) => {
            state.productParam = initParams();
        },
    },
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts';
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchProductAsync.pending, (state) => {
            state.status = 'pandingFetchProduct';
        });
        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchProductAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchFilters.pending, (state) => {
            state.status = 'pendingFetchFilters';
        });
        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.filtersLoaded = true;
            state.status = 'idle';
        });
        builder.addCase(fetchFilters.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload);
        });
    }),
});

export const productSelectors = productsAdapter.getSelectors((state: RootStore) => state.catalog);

export const {setProductsParams, resetProductParams} = catalogSlice.actions;