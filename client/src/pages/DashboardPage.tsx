import { Trash2 } from "lucide-react";

const DashboardPage = () => {
  // Mock data - you would fetch this from your API
  const notes = [
    { id: 1, title: "Note 1" },
    { id: 2, title: "Note 2" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m8.4-8.4h-1M3.6 12H2.6m16.2.2l-.8-.8M5.4 5.4l-.8-.8m13 13l-.8-.8M6.2 17.8l-.8-.8M12 5a7 7 0 100 14 7 7 0 000-14z"
            />
          </svg>
          <h1 className="text-xl font-semibold ml-3">Dashboard</h1>
        </div>
        <button className="text-blue-600 font-medium">Sign Out</button>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Welcome Card */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-1">Welcome, Jonas Kahnwald !</h2>
          <p className="text-gray-500">Email: xxxxxx@xxxx.com</p>
        </div>

        <button className="w-full text-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-6">
          Create Note
        </button>

        {/* Notes List */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Notes</h3>
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <p className="text-gray-800">{note.title}</p>
                <button className="text-gray-400 hover:text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
