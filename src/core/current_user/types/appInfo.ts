export type AppInfoResponse = {
  id: string;
  name: string;
  description: string;
  ownedByUser: boolean;
  features: string[];
  sidebarIconUrl: string;
  faviconUrl: string;
  public: boolean;
};