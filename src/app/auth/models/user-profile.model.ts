export interface UserProfile {
    id: string;
    attributes: {
      name: string,
      primaryPaymail: string
    };
}
