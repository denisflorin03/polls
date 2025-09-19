import React from 'react';

export function Test() {
  return (
    <div style={{ padding: '20px', background: 'lightblue', minHeight: '100vh' }}>
      <h1>TEST PAGE - ROUTING WORKS!</h1>
      <p>Routing works!</p>
      <a href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
        Go to Login
      </a>
    </div>
  );
}

export default Test;
