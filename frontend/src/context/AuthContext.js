import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // On initial load, try to get user from localStorage.
  // If it's not there, start with null.
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    // Save the user data to localStorage.
    // localStorage can only store strings, so we need to stringify the object.
    localStorage.setItem('user', JSON.stringify(userData));
    // Set the user state in React.
    setUser(userData);
  };

  const logout = () => {
    // Remove the user data from localStorage.
    localStorage.removeItem('user');
    // Set the user state to null.
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);