// Extend the Express namespace and Passport User interface
declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

// This export is needed to make this file a module
export {};
