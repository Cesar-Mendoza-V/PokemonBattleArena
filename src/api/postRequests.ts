import axios from "axios";

interface PostUserData {
  email: string;
  username: string;
  password: string;
}

interface ResponseData {
  httpStatusCode: number;
  message: string;
}

const url: string = process.env.SERVER_HOST as string;

export const postUserRequest = async (
  data: PostUserData
): Promise<ResponseData> => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the response data (expected to be of type `ResponseData`)
  } catch (error) {
    // Handle errors (you could also customize this depending on your needs)
    throw new Error("Error sending POST request: " + error);
  }
};
