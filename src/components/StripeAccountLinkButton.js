import React, { useEffect } from "react";
import { useState } from "react";
import { useUser } from "../UserContext";
import supabase from "../config/supabaseClient";

const StripeAccountLinkButton = ({ userId, userMetaData, stripe_id }) => {
  const [accountExists, setAccountExists] = useState("default");
  const { user } = useUser();

  const createAccountLink = async () => {
    try {
      // Step 1: Create account link
      const response = await fetch(
        "http://www.raffly.com.mx/api/create-account-link",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create account link");
      }

      const data = await response.json();
      console.log(data);

      // Step 2: Store accountId in user metadata in Supabase
      const { data: userData, error } = await supabase
        .from("user_metadata")
        .update({ stripe_id: data.accountId })
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      // Step 3: Open the account link in a new tab
      window.open(data.url, "_blank");
    } catch (error) {
      console.error(
        "Error creating account link and associating:",
        error.message
      );
    }
  };

  const generateAccountLink = async () => {
    try {
      const response = await fetch(
        "http://www.raffly.com.mx/api/generate-account-link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accountId: stripe_id }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        //window.location.href = data.url; // Redirect user to the account link
        window.open(data.url, "_blank");
      } else {
        console.error("Error generating account link:", data.error);
      }
    } catch (error) {
      console.error("Error generating account link:", error);
    }
  };

  const generateDashboardAccessLink = async () => {
    try {
      const response = await fetch(
        "http://www.raffly.com.mx/api/generate-dashboard-access-link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accountId: stripe_id }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store the dashboard access link URL in a variable or state
        const dashboardAccessLinkURL = data.url;
        // Provide the URL to the user (e.g., display it as a link or redirect)
        console.log("Stripe Dashboard Access URL:", dashboardAccessLinkURL);
        // You can open this URL in a new tab or window
        window.open(dashboardAccessLinkURL, "_blank");
      } else {
        console.error("Error generating dashboard access link:", data.error);
      }
    } catch (error) {
      console.error("Error generating dashboard access link:", error);
    }
  };

  useEffect(() => {
    checkAccountSetup();
  }, [stripe_id]);

  const checkAccountSetup = async () => {
    try {
      const response = await fetch(
        "http://www.raffly.com.mx/api/check-account-exists",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accountId: stripe_id }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.exists) {
          console.log(
            "Account exists!",
            "Payments active:",
            data.paymentsActive
          );
          if (data.paymentsActive === true) {
            setAccountExists("true");
          }
        } else {
          console.log("Account does not exist.");
        }
      } else {
        console.error("Error checking account existence:", data.error);
      }
    } catch (error) {
      console.error("Error checking account existence:", error);
    }
  };

  return (
    <>
      {stripe_id ? (
        <>
          {accountExists === "default" ? (
            <p>Cargando....</p>
          ) : accountExists === "true" ? (
            <>
              <button onClick={generateDashboardAccessLink}>
                Acceder al Dashboard de Stripe
              </button>
            </>
          ) : (
            <>
              <p>Tu cuenta aun no a sido configurada</p>
              <button onClick={generateAccountLink}>
                Continuar Configuracion
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <button onClick={createAccountLink}>Crear Cuenta Stripe</button>
        </>
      )}
    </>
  );
};

export default StripeAccountLinkButton;
