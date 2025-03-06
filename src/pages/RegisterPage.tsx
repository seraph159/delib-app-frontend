import { useState } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState("");
  const [role, setRole] = useState('');
  const [ssn, setSsn] = useState(''); 
  const [salary, setSalary] = useState(0); 
  const [isLoading, setIsLoading] = useState(false);

  interface RegisterData {
    email: string;
    password: string;
    password2: string;
    role: string;
    name: string;
    ssn?: string;
    salary?: number;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const data: RegisterData = {
        email,
        password,
        password2: confirmPassword,
        role,
        name,
      };

      if (role === 'librarian') {
        data.ssn = ssn;
        data.salary = salary;
      }

      const endpoint = role === 'librarian' 
        ? `${import.meta.env.VITE_APP_API_URL}/api/auth/librarian/register`
        : `${import.meta.env.VITE_APP_API_URL}/api/auth/client/register`;
        
      const response = await axios.post(endpoint, data);
      
      if (response.data.error) {
        setError(response.data.error);
      } else {
        console.log("success");
        alert("Successfully Registered");
      }
    } catch (error: unknown) {

      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.message || error.response?.data?.error || error.message
        : error instanceof Error 
          ? error.message 
          : 'Error registering. Please try again.';
      setError(errorMessage);
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Registration</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-5">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-5">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-5">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-5">
              <label htmlFor="role" className="block text-gray-700 font-medium mb-2">Role:</label>
              <select
                id="role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Role</option>
                <option value="client">Client</option>
                <option value="librarian">Librarian</option>
              </select>
            </div>
            {role === 'librarian' && (
              <>
                <div className="mb-5">
                  <label htmlFor="ssn" className="block text-gray-700 font-medium mb-2">SSN:</label>
                  <input
                    type="text"
                    id="ssn"
                    value={ssn}
                    onChange={(event) => setSsn(event.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="salary" className="block text-gray-700 font-medium mb-2">Salary:</label>
                  <input
                    type="number"
                    id="salary"
                    value={salary}
                    onChange={(event) => setSalary(Number(event.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </>
            )}
            <button 
              className="w-full bg-blue-500 text-white py-3 px-5 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-blue-300" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="text-gray-500 mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;