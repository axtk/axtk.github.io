export type MarkerMetadata = {
  position: [number, number];
  title: string;
  description: {
    name: string;
    province?: string;
    country: string;
  };
  resources: {
    title: string;
    author?: string;
    url?: string;
    source?: string;
  }[];
};
