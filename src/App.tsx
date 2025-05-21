import { RequestBoard } from "./Pages/RequestBoard";
import { RequestProvider } from "./Contexts/RequestContext";
import { AdminProvider } from "./Contexts/AdminContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AdminProvider>
    <RequestProvider>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-100">
        <header className="bg-indigo-700 text-white p-4 text-center text-xl font-semibold">
          Orcta Project Requests Board
        </header>
        <main className="px-4 sm:px-8 py-6">
        <RequestBoard />
        </main>
      </div>
    </RequestProvider>
    </AdminProvider>
  );
}

export default App;
