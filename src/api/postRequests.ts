interface PostUserData {
  email: string;
  username: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ResponseData {
  success: boolean;
  message: string;
  data: any;
  timestamp: string;
}

const API_URL = import.meta.env.VITE_SERVER_HOST;

export const postUserRequest = async (
  data: PostUserData
): Promise<ResponseData> => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    throw new Error("Error sending signup request: " + error);
  }
};

export const loginUserRequest = async (
  data: LoginData
): Promise<ResponseData> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    const result = await response.json();

    if (result.success && result.data && result.data.accessToken) {
      localStorage.setItem("token", result.data.accessToken);
      localStorage.setItem("user", JSON.stringify(result.data));
    }

    return result;
  } catch (error) {
    throw new Error("Error sending login request: " + error);
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

export const getCurrentUser = (): any => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
