import Login from "./components/AuthComponents/Login";
import Register from "./components/AuthComponents/Register";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-slate-300 flex items-center justify-center">
      <Register />
      {/* <Login /> */}
    </div>
  );
}

export default App;
