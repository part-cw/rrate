const fetch = require('node-fetch');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { code, redirect_uri, client_id } = JSON.parse(event.body);

    if (!code || !redirect_uri || !client_id) {
      console.error('Missing required field:', { code, redirect_uri, client_id });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing code, redirect_uri, or client_id' }),
      };
    }

    const tokenRes = await fetch('https://auth.smarthealthit.org/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        client_id,
      }).toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error('Token endpoint error:', tokenData);
      return {
        statusCode: tokenRes.status,
        body: JSON.stringify(tokenData),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(tokenData),
    };
  } catch (err) {
    console.error('Exchange error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unexpected error', details: err.message }),
    };
  }
};
