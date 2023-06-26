import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { logout, user } = useAuth();
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <h1 className="text-indigo-500 font-extrabold text-3xl md:text-5xl">
          Ready to take off ? ✈️
        </h1>
        <h2 className="text-xl font-sans text-black">
          logged in as:{" "}
          <span className="font-mono text-indigo-700">{user.username}</span>
          👋
        </h2>
      </div>
      <button
        onClick={() => logout()}
        className={`absolute top-5 right-5 md:right-10 bg-transparent border-indigo-600 border-2 rounded-md px font-semibold text-indigo-600 px-6 py-1 transition duration-300 ease-in-out hover:bg-indigo-600 hover:text-white hover:-translate-y-1 uppercase`}
      >
        Logout 🚪
      </button>
    </Layout>
  );
}
