import { useState } from "react";

function Login() {
  const [formData, setFormdata] = useState({
    username: "",

    password: "",
    conformPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefaut();
    setError("");
    if (formData.password != formData.conformPassword) {
      setError("password do not matched");
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
        throw new Error(data.message || "Registration failed");
      }

      console.log("Success:", data);
      alert("Registration Successful!");

      setFormdata({ name: "", email: "", password: "", confirmPassword: "" });
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
        >
          <h1 className="text-3xl font-bold">Login Your Account</h1>
          <input
            type="text"
            placeholder="username"
            name="username"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="password"
            name="passsword"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
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
            onSubmit={handleSubmit}
          >
            {loading ? "Loging in..." : "login"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
