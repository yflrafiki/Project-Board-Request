// src/Pages/Tags.tsx
export const Tags = () => {
  const requests = JSON.parse(localStorage.getItem("requests") || "[]");
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const taggedData = requests.flatMap((req: any) =>
    (req.taggedUsers || []).map((id: string) => ({
      project: req.projectName,
      user: users.find((u: any) => u.id === id)?.name || "Unknown",
    }))
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Tagged Users</h2>
      {taggedData.length > 0 ? (
        <ul className="space-y-2">
          {taggedData.map((tag, idx) => (
            <li key={idx} className="text-sm text-gray-700">
              <strong>{tag.user}</strong> tagged in <em>{tag.project}</em>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No tags yet.</p>
      )}
    </div>
  );
};
