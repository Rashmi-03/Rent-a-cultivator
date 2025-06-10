import './App.css';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard'; // ✅ Re-enabled
import { useState } from 'react';

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');

  const handleLoginSuccess = (username) => {
    setLoggedIn(true);
    setLoggedInUser(username);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setLoggedInUser('');
  };

  return (
    <div>
      {isLoggedIn ? (
        <div style={appStyles.loggedInContainer}>
          <Dashboard username={loggedInUser} />
          <button onClick={handleLogout} style={appStyles.logoutButton}>
            Logout
          </button>
        </div>
      ) : (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

const appStyles = {
  loggedInContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#e6ffe6',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: 'pink',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
  }
};

export default App;
