let backendAccessToken: string;

async function getBackendAccessToken() {
  if (backendAccessToken) {
    // The body of the if statement here checks the access token is still valid
    const headers = new Headers();
    let isValid = true;
    headers.set("Authorization", `Bearer ${backendAccessToken}`);
    await fetch(`${process.env.BACKEND_PB_DOMAIN_NAME}/files`, {
      headers: headers,
      method: "GET",
    })
      .then((res) => {
        // Handle invalid token
        if (
          res.status === 401 &&
          res.headers.get("WWW-Authenticate") ===
            'Bearer realm="api", error="invalid_token", error_description="Invalid Compact JWS"'
        ) {
          console.error("client.handleFileUpload: Invalid access token");
          isValid = false;
        }
      })
      .catch((e) => {
        console.error(`Error: ${e}`);
        isValid = false;
      });

    if (isValid) return backendAccessToken;
  }

  // The below code tries to obtain an access token

  // Setup headers
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  // // Setup POST body
  const reqParams = {
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: process.env.BACKEND_PB_DOMAIN_NAME,
    grant_type: "client_credentials",
  };

  const { access_token: accessToken } = await fetch(
    `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
    {
      headers: headers,
      method: "POST",
      body: JSON.stringify(reqParams),
    }
  )
    .then((res) => res.json())
    .catch((reason) => {
      console.log(`Client.handleFileUpload: Error - ${reason}`);
    });

  backendAccessToken = accessToken;
  return backendAccessToken;
}

async function fetchWithAuthFromServer(url: string, options: RequestInit) {
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${await getBackendAccessToken()}`);
  options.headers = headers;
  return fetch(url, options);
}

export { fetchWithAuthFromServer };
