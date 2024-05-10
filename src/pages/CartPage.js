import React from 'react';
import { useCart } from '../CartContext';
import CartItem from '../components/CartItem';
import styles from './CartPage.module.css'; // Import styles

const CartPage = () => {
    const { cart, removeItem, clearCart } = useCart();

    return (
        <div className={styles.cartContainer}>
            <div className={styles.cartHeader}>
                <h2>Shopping Cart</h2>
                {cart.length > 0 && (
                    <button onClick={clearCart}>Clear Cart</button>
                )}
            </div>
            {cart.length > 0 ? (
                <div className={styles.cartItems}>
                    {cart.map(item => (
                        <CartItem key={item.id} item={item} removeItem={removeItem} />
                    ))}
                </div>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default CartPage;
