import { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Loader from "./components/Loader";
import Layout from "./components/Layout";

function App() {
  const { user, checkAuth } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth(setLoading);
  }, []);

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return <>{user ? <Dashboard /> : <Auth />}</>;
}

export default App;
