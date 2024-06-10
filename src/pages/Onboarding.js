import React from "react";
import { useUser } from "../UserContext";
import supabase from "../config/supabaseClient";

import { useState } from "react";

import StripeAccountLinkButton from "../components/StripeAccountLinkButton";

const Onboarding = () => {
  const { user, userMetaData } = useUser();

  return (
    <div>
      <h1>Configuracion de Pagos</h1>
      {userMetaData[0] ? (
        <>
          <StripeAccountLinkButton
            userId={user.id}
            userMetaData={userMetaData}
            stripe_id={userMetaData[0].stripe_id}
          />
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default Onboarding;

/*
const Onboarding = () => {
  
  const createAccountLink = async () => {
    const response = await fetch('http://localhost:3001/create-account-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Store accountId with user information in your database
      await associateAccountIdWithUser(userId, data.accountId);
      window.location.href = data.url;
    } else {
      console.error('Failed to create account link');
    }
  };

  const associateAccountIdWithUser = async (userId, accountId) => {
    // Make a request to your backend to save the account ID for the user
    const response = await fetch('http://localhost:3001/save-account-id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, accountId }),
    });

    if (!response.ok) {
      console.error('Failed to save account ID');
    }
  };

  return (
    <div>
      <h1>Onboarding</h1>
      <button onClick={createAccountLink}>Connect with Stripe</button>;
    </div>
  );
};

export default Onboarding;

*/
