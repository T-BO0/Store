import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Basket } from "../models/basket";

interface StoreContextValue{
    basket: Basket | null;
    setBasket: (basket: Basket) => void;
    removeItem: (productId: number, quantity: number) => void;
}

//creates context
export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

//hook that returns object containing all states
export function useStoreContext(){
    const context = useContext(StoreContext);

    if(context === undefined)
        throw Error("oops- we do not seem to be inside the provider")

    return context;
}


//component wraps around whole app in index.tsx
export function StoreProvider({children}: PropsWithChildren<any>){
    const [basket, setBasket] = useState<Basket | null>(null);

    function removeItem(productId:number, quantity: number){
        if(!basket) return;
        const items = [...basket.items];
        const itemIndex = items.findIndex(i => i.productId === productId);
        if(itemIndex >= 0){
            items[itemIndex].quantity -=quantity;
            if(items[itemIndex].quantity === 0) items.splice(itemIndex,1);
            setBasket(privState => {
                return {...privState!, items}
            });
        }
    }
    return (
        <StoreContext.Provider value={{basket, setBasket, removeItem}}>
            {children}
        </StoreContext.Provider>
    )
}