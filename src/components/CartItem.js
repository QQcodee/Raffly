import React from 'react';
import styles from './CartItem.module.css'; // Import styles

const CartItem = ({ item, removeItem }) => {
    return (
        <div className={styles.cartItem}>
            <div className={styles.cartItemHeader}>
                <h4>{item.raffleName} - Ticket #{item.ticketNumber}</h4>
            </div>
            <div className={styles.cartItemBody}>
                <p>${item.price}</p>
            </div>
            <div className={styles.cartItemFooter}>
                <button onClick={() => removeItem(item.id)}>Remove</button>
            </div>
        </div>
    );
};

export default CartItem;
