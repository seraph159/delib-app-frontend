import React, { useEffect, useState } from "react";
import axios from "axios";

interface ClientModel {
  name: string;
  email: string;
  password:string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
}

const RegisterClient: React.FC = () => {
  const [clientModel, setClientModel] = useState<ClientModel>({
    name: "",
    email: "",
    password: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
  });
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setClientModel((prevModel) => ({
      ...prevModel,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/librarian/register`,
        clientModel, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      alert("Client registered successfully!");
      setClientModel({
        name: "",
        email: "",
        password: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
      }); // Reset form
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 400) {
        alert("Client already registered!");
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="register-client-container max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Register Client
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={clientModel.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={clientModel.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={clientModel.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
            Street Address:
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={clientModel.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-gray-700 font-medium mb-2">
            City:
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={clientModel.city}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="state" className="block text-gray-700 font-medium mb-2">
            State:
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={clientModel.state}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="zipcode" className="block text-gray-700 font-medium mb-2">
            ZipCode:
          </label>
          <input
            type="text"
            id="zipcode"
            name="zipcode"
            value={clientModel.zipcode}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Register Client
        </button>
      </form>
    </div>
  );
};

export default RegisterClient;
