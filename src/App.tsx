import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { useAuth } from "./AuthContext";
import { Book, BarChart, Users, Shield, Search, Clock } from "react-feather";
import { useNavigate, Link } from 'react-router-dom';

const App = () => {
  const { isAuthenticated, role } = useAuth();
  const [stats] = useState({
    totalBooks: 2453,
    activeUsers: 842,
    dailyTransactions: 156,
  });

  // Simulate API call for statistics
  useEffect(() => {
    // Fetch statistics from your API
    // fetch('/api/stats').then(res => res.json()).then(data => setStats(data))
  }, []);

  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/search');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            {isAuthenticated ? (
              <>
                Welcome Back,{" "}
                <span className="text-blue-600">
                  {role === "ROLE_CLIENT" ? "Reader" : "Librarian"}
                </span>
              </>
            ) : (
              "Welcome to Modern Library Management"
            )}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Efficiently manage library resources, streamline transactions, and
            provide seamless access to knowledge with our integrated platform.
          </p>

          {isAuthenticated && (
            <>
              {role === "ROLE_CLIENT" && (
                <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Search size={20} />
                      <span>Search</span>
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-gray-500 flex items-center justify-center gap-2">
                    <Clock size={14} />
                    Average response time: &lt;500ms
                  </p>
                </form>
              )}
              {role === "ROLE_LIBRARIAN" && (
                <div className="flex justify-center">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <BarChart size={20} />
                    <span>Dashboard</span>
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
            <Book className="text-blue-600" size={32} />
            <div>
              <h3 className="text-2xl font-bold">{stats.totalBooks}</h3>
              <p className="text-gray-600">Documents Available</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
            <Users className="text-green-600" size={32} />
            <div>
              <h3 className="text-2xl font-bold">{stats.activeUsers}+</h3>
              <p className="text-gray-600">Active Users</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
            <BarChart className="text-purple-600" size={32} />
            <div>
              <h3 className="text-2xl font-bold">{stats.dailyTransactions}</h3>
              <p className="text-gray-600">Daily Transactions</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            System Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Shield className="text-green-600 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
              <p className="text-gray-600">
                Role-based authentication and authorization ensuring data
                protection and privacy compliance.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Book className="text-blue-600 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">
                Comprehensive Management
              </h3>
              <p className="text-gray-600">
                Manage multiple document types, user accounts, and transactions
                through integrated RESTful APIs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Search className="text-purple-600 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">
                Advanced Search
              </h3>
              <p className="text-gray-600">
                Multi-criteria search functionality with optimized query
                performance under 500ms response time.
              </p>
            </div>
          </div>
        </section>

        {/* Role-based Sections */}
        {!isAuthenticated && (
          <section className="text-center bg-blue-50 p-8 rounded-xl mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Get Started Today
            </h2>
            <p className="text-gray-600 mb-6">
              Join our library community to access thousands of resources
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg border border-blue-600 hover:bg-blue-50"
              >
                Login
              </Link>
            </div>
          </section>
        )}

      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Library Management System. Secured with Spring Security.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;