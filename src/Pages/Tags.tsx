// src/Pages/Tags.tsx
export const Tags = () => {
  const requests = JSON.parse(localStorage.getItem("requests") || "[]");
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const tagged = requests.flatMap((req: any) =>
    (req.taggedUsers || []).map((userId: string) => {
      const user = users.find((u: any) => u.id === userId);
      return {
        project: req.projectName,
        user: user?.name || "Unknown",
      };
    })
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Tagged Users</h2>
      {tagged.length > 0 ? (
        <ul className="space-y-2 text-gray-700 text-sm">
          {tagged.map((tag, idx) => (
            <li key={idx}>
              <strong>{tag.user}</strong> tagged in <em>{tag.project}</em>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No users tagged yet.</p>
      )}
    </div>
  );
};
