import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user'))
  );

  const [token, setToken] = useState(
    localStorage.getItem('access')
  );

  const loginUser = (data) => {
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    localStorage.setItem(
      'user',
      JSON.stringify(data.user)
    );

    setToken(data.access);
    setUser(data.user);
  };

  const logoutUser = () => {
    localStorage.clear();

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);