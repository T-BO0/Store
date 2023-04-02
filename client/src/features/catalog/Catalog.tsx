import { Product } from "../../app/models/product"
import ProductList from "./ProductList";
import { useState, useEffect } from "react";


export default function Catalog(){
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(()=>{
      fetch("http://localhost:5152/api/products/")
        .then(responce => responce.json())
        .then(data => setProducts(data))
    },[]);
    return(
        <>
            <ProductList products={products}/>
        </>
    )
}