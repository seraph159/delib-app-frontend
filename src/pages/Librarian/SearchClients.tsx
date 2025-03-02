import React, { useState, useEffect } from "react";
import axios from "axios";

interface Client {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  documentsBorrowed: string[]; // Added to store currently borrowed document IDs
}

const SearchClients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalAction, setModalAction] = useState<"update" | "delete" | "">("");
  const [clientForm, setClientForm] = useState<Client>({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    documentsBorrowed: [],
  });
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  // Fetch clients from the server
  useEffect(() => {
    if (accessToken) {
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/librarian/clients`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          // response.data is an array of clients with documentsBorrowed
          const fetchedClients = response.data.map((client: any) => ({
            ...client,
            documentsBorrowed: client.documentsBorrowed || [],
          }));
          setClients(fetchedClients);
          setFilteredClients(fetchedClients);
        })
        .catch((error) => {
          console.error("Error fetching clients:", error);
          setError("Error fetching clients.");
        });
    }
  }, [accessToken]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const results = clients.filter((client) =>
      client.name.toLowerCase().includes(term.toLowerCase()) ||
      client.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredClients(results);
  };

  const handleUpdateClient = (client: Client) => {
    setSelectedClient(client);
    setClientForm({ ...client });
    setModalAction("update");
    setShowModal(true);
  };

  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client);
    setModalAction("delete");
    setShowModal(true);
  };

  const handleReturn = async (clientEmail: string, documentId: string) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/librarian/return/${clientEmail}/${documentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert(`Document ${documentId} returned successfully for ${clientEmail}`);
      // Update the client list to reflect the return
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.email === clientEmail
            ? {
                ...client,
                documentsBorrowed: client.documentsBorrowed.filter((id) => id !== documentId),
              }
            : client
        )
      );
      setFilteredClients((prevFiltered) =>
        prevFiltered.map((client) =>
          client.email === clientEmail
            ? {
                ...client,
                documentsBorrowed: client.documentsBorrowed.filter((id) => id !== documentId),
              }
            : client
        )
      );
    } catch (error: any) {
      console.error("Error returning document:", error);
      setError(error.response?.data || "Error returning document.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClient(null);
    setModalAction("");
    setClientForm({
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipcode: "",
      documentsBorrowed: [],
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setClientForm((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleModalAction = () => {
    if (!selectedClient) return;

    if (modalAction === "update") {
      axios
        .put(
          `${import.meta.env.VITE_APP_API_URL}/api/librarian/clients/${selectedClient.email}`,
          clientForm,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(() => {
          alert("Client updated successfully!");
          setClients((prevClients) =>
            prevClients.map((client) =>
              client.email === selectedClient.email ? { ...clientForm } : client
            )
          );
          setFilteredClients((prevFiltered) =>
            prevFiltered.map((client) =>
              client.email === selectedClient.email ? { ...clientForm } : client
            )
          );
          closeModal();
        })
        .catch((error) => {
          console.error("Error updating client:", error);
          setError("Error updating client.");
        });
    } else if (modalAction === "delete") {
      axios
        .delete(
          `${import.meta.env.VITE_APP_API_URL}/api/librarian/clients/${selectedClient.email}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(() => {
          alert("Client deleted successfully!");
          setClients((prevClients) =>
            prevClients.filter((client) => client.email !== selectedClient.email)
          );
          setFilteredClients((prevFiltered) =>
            prevFiltered.filter((client) => client.email !== selectedClient.email)
          );
          closeModal();
        })
        .catch((error) => {
          console.error("Error deleting client:", error);
          setError("Error deleting client.");
        });
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-4">
        <input
          type="text"
          className="block w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Search clients by name or email"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {filteredClients.map((client) => (
          <div
            key={client.email}
            className="p-4 border rounded shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">{client.name}</h2>
            <p>Email: {client.email}</p>
            <p>Address: {client.address}, {client.city}, {client.state} {client.zipcode}</p>
            <div className="mt-2">
              <p className="font-medium">Currently Borrowed:</p>
              {client.documentsBorrowed.length > 0 ? (
                <ul className="list-disc pl-5">
                  {client.documentsBorrowed.map((docId) => (
                    <li key={docId} className="flex justify-between items-center">
                      <span>{docId}</span>
                      <button
                        onClick={() => handleReturn(client.email, docId)}
                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
                      >
                        Return
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No documents borrowed</p>
              )}
            </div>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => handleUpdateClient(client)}
            >
              Update
            </button>
            <button
              className="mt-2 ml-2 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => handleDeleteClient(client)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">
              {modalAction === "update" ? "Update Client" : "Delete Client"}
            </h2>
            {modalAction === "update" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleModalAction();
                }}
              >
                <label htmlFor="name" className="block font-medium">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={clientForm.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                <label htmlFor="email" className="block font-medium">
                  Email Address
                </label>
                <input
                  id="email"
                  type="text"
                  value={clientForm.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                <label htmlFor="address" className="block font-medium">
                  Street Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={clientForm.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                <label htmlFor="city" className="block font-medium">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={clientForm.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                <label htmlFor="state" className="block font-medium">
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  value={clientForm.state}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                <label htmlFor="zipcode" className="block font-medium">
                  Zip Code
                </label>
                <input
                  id="zipcode"
                  type="text"
                  value={clientForm.zipcode}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-red-500 text-white rounded ml-2"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div>
                <p>Are you sure you want to delete this client?</p>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={handleModalAction}
                >
                  Delete
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-black rounded ml-2"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchClients;