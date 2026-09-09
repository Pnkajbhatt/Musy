import Login from "./components/AuthComponents/Login";
// import Register from "./components/AuthComponents/Register";
import Home from "./components/Home/home";
import SomeUpload from "./components/Songs/SomeUpload";
// import AllSongs from "./components/Songs/AllSongs";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-slate-300 flex items-center justify-center">
      {/* <Register /> */}
      {/* <Login />
      <Home /> */}
      <SomeUpload />
    </div>
  );
}

export default App;
