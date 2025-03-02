import React, { useState, useEffect } from "react";
import axios from "axios";

interface Document {
  copyId: number;
  documentId: string;
  title?: string;
  name?: string;
  publisher?: string;
  isbn?: string;
  edition?: number;
  year?: number;
  month?: number;
  journal?: string;
  number?: number;
  issue?: number;
  availableCopies: number;
  imageUrl?: string; // Added imageUrl field
}

interface BookAttributes {
  title: string;
  publisher: string;
  isbn: string;
  edition: number;
  year: number;
}

interface MagazineAttributes {
  name: string;
  publisher: string;
  isbn: string;
  year: number;
  month: number;
}

interface JournalAttributes {
  title: string;
  journal: string;
  number: number;
  year: number;
  issue: number;
  publisher: string;
}

type Attributes = BookAttributes | MagazineAttributes | JournalAttributes;

const SearchDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [attributes, setAttributes] = useState<Attributes | null>(null);
  const [documentType, setDocumentType] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showChangeCopiesModal, setShowChangeCopiesModal] = useState<boolean>(false);
  const [newCopies, setNewCopies] = useState<number>(0);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [imageBlobs, setImageBlobs] = useState<{ [key: string]: string }>({}); // Store blob URLs

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) setAccessToken(token);
  }, []);

  useEffect(() => {
    if (accessToken && documentType) {
      const fetchDocuments = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_API_URL}/api/librarian/searchdocuments/${documentType}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          setDocuments(response.data);
          setFilteredDocuments(response.data);

          // Fetch images for each document
          const blobPromises = response.data.map(async (doc: Document) => {
            if (doc.imageUrl) {
              try {
                const imageResponse = await axios.get(doc.imageUrl, {
                  responseType: "blob",
                });
                const blobUrl = URL.createObjectURL(imageResponse.data);
                //console.log(`Image URL for document ${doc.copyId}:`, blobUrl);
                return { copyId: doc.copyId, blobUrl };
              } catch (error) {
                console.error(`Error fetching image for document ${doc.copyId}:`, error);
                return { copyId: doc.copyId, blobUrl: "" };
              }
            }
            return { copyId: doc.copyId, blobUrl: "" };
          });

          const blobs = await Promise.all(blobPromises);
          const newImageBlobs = blobs.reduce((acc, { copyId, blobUrl }) => {
            if (blobUrl) acc[copyId] = blobUrl;
            return acc;
          }, {} as { [key: number]: string });
          setImageBlobs(newImageBlobs);
        } catch (error) {
          console.error("Error fetching documents:", error);
        }
      };
      fetchDocuments();
    }
  }, [accessToken, documentType]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const results = documents.filter((doc) =>
      (doc.title || doc.name)?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredDocuments(results);
  };

  const handleUpdateDocument = (document: Document) => {
    setSelectedDocument(document);
    let attrs: Attributes;
    if (documentType === "book") {
      attrs = {
        title: document.title || "",
        publisher: document.publisher || "",
        isbn: document.isbn || "",
        edition: document.edition || 0,
        year: document.year || 0,
      };
    } else if (documentType === "magazine") {
      attrs = {
        name: document.name || "",
        publisher: document.publisher || "",
        isbn: document.isbn || "",
        year: document.year || 0,
        month: document.month || 0,
      };
    } else if (documentType === "journal") {
      attrs = {
        title: document.title || "",
        journal: document.journal || "",
        number: document.number || 0,
        year: document.year || 0,
        issue: document.issue || 0,
        publisher: document.publisher || "",
      };
    } else {
      return;
    }
    setAttributes(attrs);
    setShowModal(true);
  };

  const handleChangeCopies = (document: Document) => {
    setSelectedDocument(document);
    setNewCopies(document.availableCopies);
    setShowChangeCopiesModal(true);
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/librarian/searchdocuments/${documentType}/${documentId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 200) {
        alert("Document deleted successfully");
        setDocuments(documents.filter((doc) => doc.documentId !== documentId));
        setFilteredDocuments(filteredDocuments.filter((doc) => doc.documentId !== documentId));
        // Clean up blob URL
        if (imageBlobs[documentId]) {
          URL.revokeObjectURL(imageBlobs[documentId]);
          setImageBlobs((prev) => {
            const newBlobs = { ...prev };
            delete newBlobs[documentId];
            return newBlobs;
          });
        }
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleSubmitUpdate = async () => {
    if (!selectedDocument || !attributes) return;
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/librarian/searchdocuments/${documentType}/${selectedDocument.documentId}`,
        attributes,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 200) {
        alert("Document updated successfully");
        setShowModal(false);
        const fetchResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/librarian/searchdocuments/${documentType}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setDocuments(fetchResponse.data);
        setFilteredDocuments(fetchResponse.data);
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleSubmitCopiesChange = async () => {
    if (!selectedDocument) return;
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/librarian/updatecopies/${documentType}/${selectedDocument.documentId}`,
        { copies: newCopies },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 200) {
        alert("Copies updated successfully");
        setShowChangeCopiesModal(false);
        const fetchResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/librarian/searchdocuments/${documentType}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setDocuments(fetchResponse.data);
        setFilteredDocuments(fetchResponse.data);
      }
    } catch (error) {
      console.error("Error updating copies:", error);
    }
  };

  const renderTypeSpecificFields = () => {
    if (!attributes) return null;
    if (documentType === "book") {
      const bookAttrs = attributes as BookAttributes;
      return (
        <>
          <input type="text" id="title" placeholder="Title" value={bookAttrs.title} onChange={(e) => setAttributes({ ...bookAttrs, title: e.target.value })} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <input type="text" id="publisher" placeholder="Publisher" value={bookAttrs.publisher} onChange={(e) => setAttributes({ ...bookAttrs, publisher: e.target.value })} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <input type="text" id="isbn" placeholder="ISBN" value={bookAttrs.isbn} onChange={(e) => setAttributes({ ...bookAttrs, isbn: e.target.value })} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <input type="number" id="edition" placeholder="Edition" value={bookAttrs.edition} onChange={(e) => setAttributes({ ...bookAttrs, edition: Number(e.target.value) })} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <input type="number" id="year" placeholder="Year" value={bookAttrs.year} onChange={(e) => setAttributes({ ...bookAttrs, year: Number(e.target.value) })} className="w-full p-2 border border-gray-300 rounded mb-4" />
        </>
      );
    } else if (documentType === "magazine") {
      const magAttrs = attributes as MagazineAttributes;
      return (
        <>
          <input type="text" id="name" placeholder="Name" value={magAttrs.name} onChange={(e) => setAttributes({ ...magAttrs, name: e.target.value })} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <input type="text" id="publisher" placeholder="Publisher" value={magAttrs.publisher} onChange={(e) => setAttributes({ ...magAttrs, publisher: e.target.value })} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <input type="text" id="isbn" placeholder="ISBN" value={magAttrs.isbn} onChange={(e) => setAttributes({ ...magAttrs, isbn: e.target.value })} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <input type="number" id="year" placeholder="Year" value={magAttrs.year} onChange={(e) => setAttributes({ ...magAttrs, year: Number(e.target.value) })} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <input type="number" id="month" placeholder="Month" value={magAttrs.month} onChange={(e) => setAttributes({ ...magAttrs, month: Number(e.target.value) })} className="w-full p-2 border border-gray-300 rounded mb-4" />
        </>
      );
    } else if (documentType === "journal") {
      const journalAttrs = attributes as JournalAttributes;
      return (
        <>
          <input type="text" id="title" placeholder="Title" value={journalAttrs.title} onChange={(e) => setAttributes({ ...journalAttrs, title: e.target.value })} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <input type="text" id="journal" placeholder="Journal" value={journalAttrs.journal} onChange={(e) => setAttributes({ ...journalAttrs, journal: e.target.value })} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <input type="number" id="number" placeholder="Number" value={journalAttrs.number} onChange={(e) => setAttributes({ ...journalAttrs, number: Number(e.target.value) })} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <input type="number" id="year" placeholder="Year" value={journalAttrs.year} onChange={(e) => setAttributes({ ...journalAttrs, year: Number(e.target.value) })} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <input type="number" id="issue" placeholder="Issue" value={journalAttrs.issue} onChange={(e) => setAttributes({ ...journalAttrs, issue: Number(e.target.value) })} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <input type="text" id="publisher" placeholder="Publisher" value={journalAttrs.publisher} onChange={(e) => setAttributes({ ...journalAttrs, publisher: e.target.value })} className="w-full p-2 border border-gray-300 rounded mb-4" />
        </>
      );
    }
    return null;
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <select
        className="block w-full p-2 border border-gray-300 rounded mb-4"
        onChange={(e) => setDocumentType(e.target.value)}
      >
        <option value="">Select Document Type</option>
        <option value="magazine">Magazine</option>
        <option value="book">Book</option>
        <option value="journal">Journal</option>
      </select>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Search by title"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 gap-4">
        {filteredDocuments.map((document) => (
          <div key={document.copyId} className="p-4 border rounded shadow flex items-center">
            {imageBlobs[document.copyId] ? (
              <img
                src={imageBlobs[document.copyId]}
                alt={document.title || document.name}
                className="w-24 h-24 object-cover mr-4 rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-image.jpg"; // Fallback image
                }}
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 mr-4 rounded flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{document.title || document.name}</h2>
              <p>Copies: {document.availableCopies}</p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
                onClick={() => handleUpdateDocument(document)}
              >
                Update
              </button>
              <button
                className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded mt-2"
                onClick={() => handleChangeCopies(document)}
              >
                Change Copies
              </button>
              <button
                className="ml-2 px-4 py-2 bg-red-500 text-white rounded mt-2"
                onClick={() => handleDeleteDocument(document.documentId)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedDocument && attributes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Update Document</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitUpdate(); }}>
              {renderTypeSpecificFields()}
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                Save
              </button>
              <button
                type="button"
                className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {showChangeCopiesModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Change Copies</h2>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={newCopies}
              onChange={(e) => setNewCopies(Number(e.target.value))}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleSubmitCopiesChange}
            >
              Save
            </button>
            <button
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setShowChangeCopiesModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDocuments;