import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";

interface Document {
  documentId: string;
  book?: {
    title: string;
    publisher: string;
    year: number;
    imageUrl?: string;
  };
  magazine?: {
    name: string;
    publisher: string;
    year: number;
    imageUrl?: string;
  };
  journalArticle?: {
    title: string;
    publisher: string;
    year: number;
    imageUrl?: string;
  };
  availableCopies?: number;
}

const DocumentSearch: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [isbn, setIsbn] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [publisher, setPublisher] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<string>("asc"); // Default to "asc"
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [imageBlobs, setImageBlobs] = useState<{ [key: string]: string }>({});
  const [borrowDurations, setBorrowDurations] = useState<{ [key: string]: string }>({});

  const pageSize = 10;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) setAccessToken(token);
  }, []);

  useEffect(() => {
    return () => {
      Object.values(imageBlobs).forEach((blobUrl) => URL.revokeObjectURL(blobUrl));
    };
  }, [imageBlobs]);

  const handleSearch = async (page: number = 0) => {
    try {
      const requestBody = {
        title: title || null,
        isbn: isbn || null,
        year: year ? parseInt(year) : null,
        publisher: publisher || null,
        sortBy: sortBy || null,
        sortDirection: sortDirection || null, // Include sortDirection in request
        onlyAvailable,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/client/search?page=${page}&size=${pageSize}`,
        requestBody,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const fetchedDocuments = response.data.content;
      setDocuments(fetchedDocuments);
      setCurrentPage(response.data.number);
      setTotalPages(response.data.totalPages);
      setError("");

      const blobPromises = fetchedDocuments.map(async (doc: Document) => {
        const imageUrl = doc.book?.imageUrl || doc.magazine?.imageUrl || doc.journalArticle?.imageUrl;
        if (imageUrl) {
          try {
            const imageResponse = await axios.get(imageUrl, {
              responseType: "blob",
            });
            const blobUrl = URL.createObjectURL(imageResponse.data);
            return { documentId: doc.documentId, blobUrl };
          } catch (error) {
            console.error(`Error fetching image for document ${doc.documentId}:`, error);
            return { documentId: doc.documentId, blobUrl: "" };
          }
        }
        return { documentId: doc.documentId, blobUrl: "" };
      });

      const blobs = await Promise.all(blobPromises);
      const newImageBlobs = blobs.reduce((acc, { documentId, blobUrl }) => {
        if (blobUrl) acc[documentId] = blobUrl;
        return acc;
      }, {} as { [key: string]: string });

      Object.values(imageBlobs).forEach((blobUrl) => URL.revokeObjectURL(blobUrl));
      setImageBlobs(newImageBlobs);
    } catch (error) {
      setError("Error retrieving documents. Please try again.");
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) handleSearch(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) handleSearch(currentPage - 1);
  };

  const handleBorrow = async (documentId: string) => {
    const duration = borrowDurations[documentId] || "4 weeks";
    const [value, unit] = duration.split(" ");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/client/${documentId}/borrow`,
        { value: parseInt(value), unit },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.documentId === documentId
            ? { ...doc, availableCopies: doc.availableCopies ? doc.availableCopies - 1 : 0 }
            : doc
        )
      );

      alert(
        `Document borrowed successfully for ${duration}: ${
          response.data.book?.title || response.data.magazine?.name || response.data.journalArticle?.title
        }`
      );
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Error borrowing the document. Please try again.");
      }
    }
  };

  const handleDurationChange = (documentId: string, value: string) => {
    setBorrowDurations((prev) => ({ ...prev, [documentId]: value }));
  };

  return (
    <>
      <Navbar />
      <div>
        {/* Search Form */}
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Search Documents</h2>
          <div className="bg-white p-6 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="border rounded p-2"
              />
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="ISBN"
                className="border rounded p-2"
              />
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Year"
                className="border rounded p-2"
              />
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Publisher"
                className="border rounded p-2"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded p-2"
              >
                <option value="">Sort By</option>
                <option value="title">Title</option>
                <option value="year">Year</option>
                <option value="publisher">Publisher</option>
                <option value="availableCopies">Available Copies</option>
              </select>
              <select
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value)}
                className="border rounded p-2"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-5 h-5"
                />
                <label className="text-sm">Only Available</label>
              </div>
            </div>
            <div className="text-center mt-6">
              <button
                onClick={() => handleSearch(0)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="container mx-auto p-6">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.length > 0 &&
              documents.map((doc) => (
                <div key={doc.documentId} className="bg-white p-4 rounded shadow-md flex">
                  <div className="mr-4 flex-shrink-0">
                    {imageBlobs[doc.documentId] ? (
                      <img
                        src={imageBlobs[doc.documentId]}
                        alt={doc.book?.title || doc.magazine?.name || doc.journalArticle?.title}
                        className="w-24 h-32 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-24 h-32 bg-gray-200 rounded border flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-lg font-bold">
                      {doc.book?.title || doc.magazine?.name || doc.journalArticle?.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {doc.book?.publisher || doc.magazine?.publisher || doc.journalArticle?.publisher}
                    </p>
                    <p className="text-sm text-gray-600">
                      {doc.book?.year || doc.magazine?.year || doc.journalArticle?.year}
                    </p>
                    <p className="text-sm">Available Copies: {doc.availableCopies ?? 0}</p>

                    {(doc.availableCopies ?? 0) > 0 && (
                      <div className="mt-2 flex items-center space-x-2">
                        <select
                          value={borrowDurations[doc.documentId] || "4 weeks"}
                          onChange={(e) => handleDurationChange(doc.documentId, e.target.value)}
                          className="border rounded p-1 text-sm"
                        >
                          <option value="1 week">1 Week</option>
                          <option value="2 weeks">2 Weeks</option>
                          <option value="3 weeks">3 Weeks</option>
                          <option value="4 weeks">4 Weeks</option>
                          <option value="7 days">7 Days</option>
                          <option value="14 days">14 Days</option>
                        </select>
                        <button
                          onClick={() => handleBorrow(doc.documentId)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow"
                        >
                          Borrow
                        </button>
                      </div>
                    )}
                    {(doc.availableCopies ?? 0) <= 0 && (
                      <button
                        disabled
                        className="mt-4 px-4 py-2 bg-gray-400 cursor-not-allowed rounded shadow"
                      >
                        Borrow
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className={`px-4 py-2 rounded ${
                  currentPage === 0 ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Previous
              </button>
              <span className="text-sm">Page {currentPage + 1} of {totalPages}</span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages - 1
                    ? "bg-gray-300"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DocumentSearch;