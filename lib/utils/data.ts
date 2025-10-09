// lib/demo-data.ts
export interface User {
  id: string;
  name: string;
  email: string;
  telephone: string;
  points: number;
}

export const demoUsers: User[] = [
  {
    id: "CUST001",
    name: "Srikanto Roy",
    email: "srikanto@example.com",
    telephone: "01580425332",
    points: 120,
  },
  {
    id: "CUST002",
    name: "Anika Rahman",
    email: "anika@example.com",
    telephone: "01712345678",
    points: 80,
  },
  {
    id: "CUST003",
    name: "Jamal Uddin",
    email: "jamal@example.com",
    telephone: "01898765432",
    points: 50,
  },
  {
    id: "CUST004",
    name: "Farhana Akter",
    email: "farhana@example.com",
    telephone: "01987654321",
    points: 200,
  },
  {
    id: "CUST005",
    name: "Rashed Khan",
    email: "rashed@example.com",
    telephone: "01655556666",
    points: 0,
  },
];
