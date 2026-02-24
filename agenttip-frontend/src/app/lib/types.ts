export interface AgentData {
  name: string;
  description: string;
  address: string;
  reputation: number;
  earnings: number;
  servicesCompleted: number;
  servicesListed: number;
  network: string;
  tokenSymbol: string;
}

export interface ServiceData {
  id: number;
  name: string;
  description: string;
  price: number;
  status: string;
  completions: number;
}

export interface TxData {
  id: number;
  service: string;
  amount: number;
  status: string;
  hash: string;
  timestamp: string;
}

export interface FeedPost {
  id: number;
  title: string;
  content: string;
  author: string;
  time: string;
  upvotes: number;
}
