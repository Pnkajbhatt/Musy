import { useState } from "react";

function Login() {
  const [formData, setFormdata] = useState({
    username: "",
    password: "",
    conformPassword: "",
  });
  const [visible, setVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePasswordVisibility = () => {
    setVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    if (formData.password != formData.conformPassword) {
      setError("password do not matched");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const token =
        data.token ?? data.Token ?? data.data?.token ?? data.data?.Token;
      if (token) {
        localStorage.setItem("token", token);
      }

      console.log("Success:", data);
      alert("login Successful!");

      setFormdata({
        username: "",

        password: "",
        conformPassword: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className=" bg-green-200 px-4 py-6 rounded-2xl shadow-xl">
        <form
          action=""
          method="post"
          className="flex flex-col gap-6 justify-center "
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-bold">Login Your Account</h1>
          <input
            type="text"
            placeholder="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <div className="vis">
            <input
              type={visible ? "text" : "password"}
              placeholder="Passwords"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button" // important: type="button" else it will submit form
              onClick={handlePasswordVisibility}
              className="p-2"
            >
              {visible ? "Hide" : "Show"}
            </button>
          </div>

          <input
            type="password"
            placeholder="ConformPassword"
            name="conformPassword"
            value={formData.conformPassword}
            onChange={handleChange}
            required
          />

          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            type="submit"
            className=" rounded-sm bg-green-500 h-9 font-bold text-xl"
          >
            {loading ? "Login...." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
