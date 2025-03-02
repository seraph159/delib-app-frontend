import React, { useEffect, useState } from "react";
import { addDocument, uploadImage } from "../../api/documentService";

interface DocumentAttributes {
  title?: string;
  author?: string;
  publisher?: string;
  year?: number;
  availableCopies?: number;
  numpages?: number;
  edition?: number;
  isbn?: string;
  month?: number;
  issue?: string;
  volume?: string;
  journal?: string;
  number?: number;
  imageUrl?: string; // To store the uploaded image URL
}

const AddDocument: React.FC = () => {
  const [documentType, setDocumentType] = useState<string>("");
  const [documentAttributes, setDocumentAttributes] = useState<DocumentAttributes>({
    title: "",
    author: "",
    publisher: "",
    year: 0,
    availableCopies: 0,
    isbn: "",
    issue: "",
    volume: "",
    numpages: 0,
    edition: 0,
    month: 0,
    number: 0,
    journal: "",
    imageUrl: "", // Initialize imageUrl
  });
  const [imageFile, setImageFile] = useState<File | null>(null); // State for the selected image file
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentType(e.target.value);
    setDocumentAttributes({
      title: "",
      author: "",
      publisher: "",
      year: 0,
      availableCopies: 0,
      isbn: "",
      issue: "",
      volume: "",
      numpages: 0,
      edition: 0,
      month: 0,
      number: 0,
      journal: "",
      imageUrl: "",
    }); // Reset attributes when type changes
    setImageFile(null); // Reset image file
  };

  const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDocumentAttributes({
      ...documentAttributes,
      [name]:
        name === "year" ||
        name === "availableCopies" ||
        name === "numpages" ||
        name === "edition" ||
        name === "month" ||
        name === "number"
          ? +value
          : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentType) {
      alert("Please select a document type.");
      return;
    }

    try {
      let updatedAttributes = { ...documentAttributes };

      // Upload image if one is selected
      if (imageFile) {
        const containerName = "delib-image-container"; // Hardcoded for simplicity; could be a form field
        const imageUrl = await uploadImage(containerName, imageFile, accessToken);
        updatedAttributes = { ...updatedAttributes, imageUrl };
      }

      // Add document with the updated attributes (including imageUrl if uploaded)
      await addDocument(documentType, updatedAttributes, accessToken);
      alert("Document added successfully!");
      setDocumentType("");
      setDocumentAttributes({
        title: "",
        author: "",
        publisher: "",
        year: 0,
        availableCopies: 0,
        isbn: "",
        issue: "",
        volume: "",
        numpages: 0,
        edition: 0,
        month: 0,
        number: 0,
        journal: "",
        imageUrl: "",
      });
      setImageFile(null);
    } catch (error: any) {
      alert("Error adding document: " + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Document</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="documentType" className="block text-gray-700 font-medium mb-2">
            Document Type:
          </label>
          <select
            id="documentType"
            name="documentType"
            value={documentType}
            onChange={handleDocumentTypeChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Document Type</option>
            <option value="book">Book</option>
            <option value="magazine">Magazine</option>
            <option value="journal">Journal</option>
          </select>
        </div>

        {documentType && (
          <>
            {/* Shared Fields */}
            <div>
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Title/Name:
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={documentAttributes.title || ""}
                onChange={handleAttributeChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-gray-700 font-medium mb-2">
                Author:
              </label>
              <input
                id="author"
                type="text"
                name="author"
                value={documentAttributes.author || ""}
                onChange={handleAttributeChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="publisher" className="block text-gray-700 font-medium mb-2">
                Publisher:
              </label>
              <input
                id="publisher"
                type="text"
                name="publisher"
                value={documentAttributes.publisher || ""}
                onChange={handleAttributeChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="year" className="block text-gray-700 font-medium mb-2">
                Publication Year:
              </label>
              <input
                id="year"
                type="number"
                name="year"
                value={documentAttributes.year || ""}
                onChange={handleAttributeChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="availableCopies" className="block text-gray-700 font-medium mb-2">
                Copies:
              </label>
              <input
                id="availableCopies"
                type="number"
                name="availableCopies"
                value={documentAttributes.availableCopies || ""}
                onChange={handleAttributeChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
                Upload Image:
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Conditional Fields */}
            {documentType === "book" && (
              <>
                <div>
                  <label htmlFor="numpages" className="block text-gray-700 font-medium mb-2">
                    Number of Pages:
                  </label>
                  <input
                    id="numpages"
                    type="number"
                    name="numpages"
                    value={documentAttributes.numpages || ""}
                    onChange={handleAttributeChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edition" className="block text-gray-700 font-medium mb-2">
                    Edition:
                  </label>
                  <input
                    id="edition"
                    type="number"
                    name="edition"
                    value={documentAttributes.edition || ""}
                    onChange={handleAttributeChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="isbn" className="block text-gray-700 font-medium mb-2">
                    ISBN:
                  </label>
                  <input
                    id="isbn"
                    type="text"
                    name="isbn"
                    value={documentAttributes.isbn || ""}
                    onChange={handleAttributeChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </>
            )}
            {documentType === "magazine" && (
              <>
                <div>
                  <label htmlFor="month" className="block text-gray-700 font-medium mb-2">
                    Month:
                  </label>
                  <input
                    id="month"
                    type="number"
                    name="month"
                    value={documentAttributes.month || ""}
                    onChange={handleAttributeChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="isbn" className="block text-gray-700 font-medium mb-2">
                    ISBN:
                  </label>
                  <input
                    id="isbn"
                    type="text"
                    name="isbn"
                    value={documentAttributes.isbn || ""}
                    onChange={handleAttributeChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="issue" className="block text-gray-700 font-medium mb-2">
                    Issue Number:
                  </label>
                  <input
                    id="issue"
                    type="text"
                    name="issue"
                    value={documentAttributes.issue || ""}
                    onChange={handleAttributeChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </>
            )}
            {documentType === "journal" && (
              <>
                <div>
                  <label htmlFor="journal" className="block text-gray-700 font-medium mb-2">
                    Journal:
                  </label>
                  <input
                    id="journal"
                    type="text"
                    name="journal"
                    value={documentAttributes.journal || ""}
                    onChange={handleAttributeChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="number" className="block text-gray-700 font-medium mb-2">
                    Number:
                  </label>
                  <input
                    id="number"
                    type="number"
                    name="number"
                    value={documentAttributes.number || ""}
                    onChange={handleAttributeChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="issue" className="block text-gray-700 font-medium mb-2">
                    Issue Number:
                  </label>
                  <input
                    id="issue"
                    type="text"
                    name="issue"
                    value={documentAttributes.issue || ""}
                    onChange={handleAttributeChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
              Add Document
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default AddDocument;