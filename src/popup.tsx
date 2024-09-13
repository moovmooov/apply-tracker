import "~/style.css";
import { useStorage } from "@plasmohq/storage/hook";
import Home from "./pages/home";
import Login from "./pages/login";

function IndexPopup() {
  const [userData] = useStorage("user_data");
  console.log(userData);
  return (
    <div className="min-w-[400px]">
      {userData?.access_token ? <Home userData={userData} /> : <Login />}
    </div>
  );
}

export default IndexPopup;
