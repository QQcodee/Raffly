import { useEffect } from "react";
import { useCart } from "../CartContext";

const LimpiarCarrito = () => {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div>
      <h1>Carrito limpiado</h1>
    </div>
  );
};

export default LimpiarCarrito;
