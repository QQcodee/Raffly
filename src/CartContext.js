import React, { createContext, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            return [...state, { ...action.payload, id: uuidv4(), quantity: 1 }]; // Initialize quantity to 1
        case 'REMOVE_ITEM':
            return state.filter(item => item.id !== action.payload.id);
        case 'CLEAR_CART':
            return [];
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, []);

    const addItem = (item) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
    };

    const removeItem = (itemId) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { id: itemId } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, cartCount, addItem, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);
