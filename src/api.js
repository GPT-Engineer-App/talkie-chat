import axios from "axios";

const uploadAudio = async (blob) => {
  const formData = new FormData();
  formData.append("file", blob, "audio.wav");

  try {
    const response = await axios.post("http://localhost:3001/api", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading audio:", error);
    throw error;
  }
};

export { uploadAudio };
