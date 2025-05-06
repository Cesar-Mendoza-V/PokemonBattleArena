interface PostUserData {
  email: string;
  username: string;
  password: string;
}

interface ResponseData {
  httpStatusCode: number;
  message: string;
}

const url: string = import.meta.env.VITE_SERVER_HOST as string;

export const postUserRequest = async (
  data: PostUserData
): Promise<ResponseData> => {
  try {
    const response = await fetch(url + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json(); // Parse and return response JSON
  } catch (error) {
    throw new Error("Error sending POST request: " + error);
  }
};
