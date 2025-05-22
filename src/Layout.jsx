import { Link } from "wasp/client/router";
import { useAuth, logout } from "wasp/client/auth";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from './hooks/useTheme';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import "./Main.css";

export const Layout = () => {
  const { data: user } = useAuth();
  const location = useLocation();

  if (location.pathname === '/') {
    return <Navigate to="/features" replace />;
  }

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-900 border-b border-primary-800 dark:border-dark-border">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/features">
              <h1 className="text-xl2 font-semibold text-black dark:text-white">FeatureBoard</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              {user ? (
                <span className="flex items-center space-x-2 text-black dark:text-white">
                  <span>Hi, {user.identities.username?.id}!</span>
                  <button 
                    onClick={logout} 
                    className="underline hover:text-primary-200 dark:hover:text-primary-400 transition-colors"
                  >
                    (Log out)
                  </button>
                </span>
              ) : (
                <div className="space-x-4 text-black dark:text-white">
                  <Link to="/login">
                    <span className="underline hover:text-primary-200 dark:hover:text-primary-400 transition-colors">
                      Log in
                    </span>
                  </Link>
                  <Link to="/signup">
                    <span className="underline hover:text-primary-200 dark:hover:text-primary-400 transition-colors">
                      Sign up
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex-grow text-gray-900 dark:text-white">
          <Outlet />
        </main>
        <footer className="mt-auto border-t border-gray-200 dark:border-dark-border">
          <div className="container mx-auto p-4">
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
              RoadmapBoard ~ Powered by Wasp
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};