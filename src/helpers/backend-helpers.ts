let backendAccessToken: string;

async function getApiAccessToken() {
  if (backendAccessToken) {
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
    "https://dev-7evmxvmnal26wubc.us.auth0.com/oauth/token",
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

async function fetchWithAuthFromClient(url: string, options: RequestInit) {
  "use server";
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${await getApiAccessToken()}`);
  options.headers = headers;
  const res = await fetch(url, options);
  return {
    res: res,
  };
}

async function fetchWithAuthFromServer(url: string, options: RequestInit) {
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${await getApiAccessToken()}`);
  options.headers = headers;
  return fetch(url, options);
}

export { fetchWithAuthFromClient, fetchWithAuthFromServer };