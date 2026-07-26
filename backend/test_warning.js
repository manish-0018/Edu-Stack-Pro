(async () => {
  try {
    const resAuth = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@attendease.com', // or whatever the admin email is
        password: 'password'
      })
    });
    const authData = await resAuth.json();
    const token = authData.token;
    
    console.log("Got token:", token ? token.substring(0, 20) + "..." : "No token");
    
    const res = await fetch('http://localhost:5000/api/warnings/trigger', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (err) {
    console.error("Error:", err.message);
  }
})();
