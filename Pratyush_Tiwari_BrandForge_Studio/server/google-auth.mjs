// Server-only authentication. Never import this module into the browser bundle.
export async function getGoogleAccessToken(oidcToken = process.env.VERCEL_OIDC_TOKEN) {
  const required = ['GCP_PROJECT_NUMBER', 'GCP_SERVICE_ACCOUNT_EMAIL', 'GCP_WORKLOAD_IDENTITY_POOL_ID', 'GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID'];
  for (const name of required) if (!process.env[name]) throw new Error(`Missing ${name}`);
  if (!oidcToken) throw new Error('A Vercel production OIDC token is required.');
  const audience = `//iam.googleapis.com/projects/${process.env.GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${process.env.GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`;
  const exchange = await fetch('https://sts.googleapis.com/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      audience,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      requested_token_type: 'urn:ietf:params:oauth:token-type:access_token',
      subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
      subject_token: oidcToken,
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (!exchange.ok) throw new Error(`Google federation rejected authentication (HTTP ${exchange.status}).`);
  const federated = await exchange.json();
  if (!federated.access_token) throw new Error('Google returned no federated token.');
  const impersonation = await fetch(`https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${encodeURIComponent(process.env.GCP_SERVICE_ACCOUNT_EMAIL)}:generateAccessToken`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${federated.access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ scope: ['https://www.googleapis.com/auth/cloud-platform'], lifetime: '600s' }),
    signal: AbortSignal.timeout(20000),
  });
  if (!impersonation.ok) throw new Error(`Google service-account access rejected (HTTP ${impersonation.status}).`);
  const result = await impersonation.json();
  if (!result.accessToken) throw new Error('Google returned no service-account token.');
  return result.accessToken;
}
