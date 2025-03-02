import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';

interface AccountData {
  name?: string;
  email?: string;
  address?: string;
  totalOverdueFees?: number;
  documentsBorrowed?: string[];
}

interface CreditCard {
  cardNo: string;
  cardHolderName: string;
}

const AccountInfo: React.FC = () => {
  const [accountData, setAccountData] = useState<AccountData>({});
  const [creditCard, setCreditCard] = useState<CreditCard | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editCardDetails, setEditCardDetails] = useState<CreditCard | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
    useEffect(() => {
      const token = localStorage.getItem("authToken");
      if (token) setAccessToken(token);
    }, []);

  useEffect(() => {
    if (accessToken) {
    const fetchAccountData = async () => {
      try {
        const response = await axios.get<AccountData>(`${import.meta.env.VITE_APP_API_URL}/api/client/account-info`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        setAccountData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCreditCard = async () => {
      try {
        const response = await axios.get<CreditCard>(`${import.meta.env.VITE_APP_API_URL}/api/client/credit-card`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
    
        setCreditCard(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAccountData();
    fetchCreditCard();
    }
  }, [accessToken]);


  const handleEditCreditCard = async () => {
    if (!editCardDetails) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/client/credit-card`,
        editCardDetails,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setCreditCard(response.data);
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCreditCard = async () => {
    if (!creditCard) return;
    try {
      await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/client/credit-card`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setCreditCard({ cardNo: '', cardHolderName: '' });
    } catch (error) {
      console.error(error);
    }
  };

  return (

    <>
    <Navbar />
    <div>
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Account Information Section */}
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <p className="mb-2">
              <strong>Name:</strong> {accountData.name}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {accountData.email}
            </p>
            <div className="mb-2">
              <strong>Address:</strong>
              <ul className="list-disc list-inside">
                {accountData.address}
              </ul>
            </div>
            <p className="mb-2">
              <strong>Overdue Fees:</strong> ${accountData.totalOverdueFees?.toFixed(2)}
            </p>
            <div>
              <strong>Documents Borrowed:</strong>
              <ul className="list-disc list-inside">
                {accountData.documentsBorrowed?.map((document, index) => (
                  <li key={index}>{document}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Information Section */}
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            {creditCard ? (
                <div>
                  {isEditing ? (
                    <div>
                      <label className="block mb-2">
                        Card Holder Name:
                        <input
                          type="text"
                          value={editCardDetails?.cardHolderName || ''}
                          onChange={(e) =>
                            setEditCardDetails({
                              ...editCardDetails!,
                              cardHolderName: e.target.value,
                            })
                          }
                          className="w-full border px-2 py-1"
                        />
                      </label>
                      <label className="block mb-2">
                        Card Number:
                        <input
                          type="text"
                          value={editCardDetails?.cardNo || ''}
                          onChange={(e) =>
                            setEditCardDetails({
                              ...editCardDetails!,
                              cardNo: e.target.value,
                            })
                          }
                          className="w-full border px-2 py-1"
                        />
                      </label>
                      <div className="flex gap-4 mt-4">
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
                          onClick={() => handleEditCreditCard()}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-600 text-white px-4 py-2 rounded-md shadow hover:bg-gray-700"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2">
                        <strong>Card Holder:</strong> {creditCard.cardHolderName}
                      </p>
                      <p className="mb-2">
                        <strong>Card Number:</strong> {creditCard.cardNo}
                      </p>
                      <div className="flex gap-4 mt-4">
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
                          onClick={() => {
                            setIsEditing(true);
                            setEditCardDetails(creditCard); // Initialize edit details
                          }}
                        >
                          Edit Credit Card
                        </button>
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700"
                          onClick={() => handleDeleteCreditCard()}
                        >
                          Delete Credit Card
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700"
                  onClick={() => {
                    setIsEditing(true);
                    setCreditCard({ cardNo: '', cardHolderName: '' });
                }
                  }
                >
                  Add Credit Card
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AccountInfo;