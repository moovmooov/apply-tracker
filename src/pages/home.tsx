import React from "react";
import { ExternalLink } from 'lucide-react';

interface UserData {
  access_token: string;
  bot_id: string;
  duplicated_template_id: string;
  owner: {
    type: string;
    user: {
      name: string;
      avatar_url: string;
    };
  };
  workspace_name: string;
  workspace_icon: string;
}

interface HomeProps {
  userData: UserData;
}

const Home: React.FC<HomeProps> = ({ userData }) => {
  const saveJob = async () => {
    console.log("Saving job to Notion...");
  };

  return (
    <div className="w-full max-w-md p-8 bg-white font-sans shadow-lg rounded-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Apply Tracker</h1>
        <p className="text-sm text-gray-600 mt-2">Welcome to your Notion workspace</p>
      </div>

      <div className="flex items-center justify-center mb-6">
        <img src={userData.owner.user.avatar_url} alt="User Avatar" className="w-16 h-16 rounded-full mr-4" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{userData.owner.user.name}</h2>
          <p className="text-sm text-gray-600">Tracker on {userData.workspace_icon} {userData.workspace_name}</p>
        </div>
      </div>

      <button 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition duration-300 flex items-center justify-center gap-2"
        onClick={saveJob}
      >
        <ExternalLink size={20} />
        Go to your Job Tracker
      </button>

    </div>
  );
};

export default Home;