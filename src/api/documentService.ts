import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_APP_API_URL}/api/librarian`;

export const uploadImage = async (containerName: string, file: File, accessToken: string | null): Promise<string> => {
  const formData = new FormData();
  formData.append("containerName", containerName);
  formData.append("file", file);

  const response = await axios.post(
    `${import.meta.env.VITE_APP_API_URL}/api/librarian/images`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data; //  the backend returns the imageUrl as a string
};


export const addDocument = async (documentType: string, documentAttributes: any, accessToken: string | null): Promise<void> => {
  let endpoint = "";

  // Map document types to respective endpoints
  switch (documentType.toLowerCase()) {
    case "book":
      endpoint = `${API_BASE_URL}/addbook`;
      break;
    case "magazine":
      endpoint = `${API_BASE_URL}/addmagazine`;
      break;
    case "journal":
      endpoint = `${API_BASE_URL}/addjournal`;
      break;
    default:
      throw new Error("Invalid document type");
  }

  try {
    await axios.post(endpoint, documentAttributes, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    );
  } catch (error: Error | unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // API returned an error response
      throw new Error(error.response.data || "Failed to add document");
    } else {
      // Network or other error
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }
};
