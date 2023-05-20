import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import { loadStripe } from "@stripe/stripe-js";
import { useAppDispatch } from "../../app/store/configureStore";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { setBasket } from "../Basket/basketSlice";
import LoadingComponent from "../../app/layout/LoadComponent";

const stripePromise = loadStripe('pk_test_51N8IyQJrCB5YIBQv8tF2yRNuWzqoJDekav66OHl4IhlB1WdlkJkCliY0CrvSe5wDyyRSAPFs3I7qqiPkVyPhXwM000UPy9FV7d');

export default function CheckoutWrapper(){
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Payment.createPaymentIntent()
            .then(basket => dispatch(setBasket(basket)))
            .catch(error => console.log(error))
            .finally(()=>setLoading(false));
    }, [dispatch]);

    if(loading) return <LoadingComponent message="loading checkout..."/>
    return(
        <Elements stripe={stripePromise}>
            <CheckoutPage/>
        </Elements>
    )
}