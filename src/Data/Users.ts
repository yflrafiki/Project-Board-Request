// src/Data/Users.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export const RegisteredUsers: User[] = [
  { id: "u1", name: "Alice Johnson", email: "alice@orcta.com" },
  { id: "u2", name: "Bob Smith", email: "bob@orcta.com" },
  { id: "u3", name: "Carla White", email: "carla@orcta.com" },
  { id: "u4", name: "David Lee", email: "david@orcta.com" },
];
