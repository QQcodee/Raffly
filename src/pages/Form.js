import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(
  "pk_test_51PO7ArItMOkvrGWYgiBdCuO8i16vzXxF8a4KitkwrqFLcbJQZ8CzZFnGK2mcGAAGpbJIoLommyfBdKrGEgVv2Ykl000rlrcsZY"
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      console.log("paymentMethod:", paymentMethod);
      const { id } = paymentMethod;

      const { data } = await axios.post("http://localhost:3001/api/checkout", {
        amount: 2000,
        id,
      });

      console.log("data:", data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button>Buy</button>
    </form>
  );
};

function Form() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default Form;
