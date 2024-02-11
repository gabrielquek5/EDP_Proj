import { useState, useEffect } from 'react';

export const useUserData = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userDataCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('userData'))
      ?.split('=')[1];

    if (userDataCookie) {
      const parsedUserData = JSON.parse(userDataCookie);
      console.log('User data retrieved from cookie:', parsedUserData);
      setUserData(parsedUserData);
    } else {
      console.log('No user data found in cookie.');
    }
  }, []);

  const setUserDataCookie = (data) => {
    document.cookie = `userData=${JSON.stringify(data)}; expires=Thu, 18 Dec 2030 12:00:00 UTC; path=/`;
    console.log('User data set in cookie:', data);
    setUserData(data);
  };

  return { userData, setUserDataCookie };
};
