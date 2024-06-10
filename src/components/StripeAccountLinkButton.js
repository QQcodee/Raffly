import React, { useEffect } from "react";
import { useState } from "react";

const StripeAccountLinkButton = ({ userId, userMetaData, stripe_id }) => {
  const [accountExists, setAccountExists] = useState("default");

  const createAccountLink = async () => {
    const response = await fetch("http://localhost:3001/create-account-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      // Store accountId in user metadata in Supabase
      await associateAccountIdWithUser(userId, data.accountId);
      //window.location.href = data.url;
      window.open(data.url, "_blank");
    } else {
      console.error("Failed to create account link");
    }
  };

  const associateAccountIdWithUser = async (userId, accountId) => {
    const response = await fetch("http://localhost:3001/save-account-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, accountId }),
    });

    if (!response.ok) {
      console.error("Failed to save account ID");
    }
  };

  const generateAccountLink = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/generate-account-link",
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
        "http://localhost:3001/generate-dashboard-access-link",
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
        "http://localhost:3001/check-account-exists",
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
              <p>Tu cuenta ya a sido configurada</p>
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
