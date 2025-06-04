import axios from "axios";

export const authUser = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get("/api/auth", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(data)
    if (data.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error during API call:", error);
    return false;
  }
};
