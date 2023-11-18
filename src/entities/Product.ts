export type Price = {
  description: string;
  price: number;
};

export type Product = {
  name: string;
  prices: Price[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};
