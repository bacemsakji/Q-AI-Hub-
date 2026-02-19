import { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      const redirectPath = location.pathname + location.search;

      navigate(
        `/login?redirect=${encodeURIComponent(redirectPath)}`,
        {
          state: {
            returnUrl: redirectPath,
            eventName: (location.state as any)?.eventName,
          },
          replace: true,
        }
      );
    }
  }, [location, navigate]);

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}

