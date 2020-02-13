export interface AuctionForm {
  requirement: string;
  bid: number;
  status: string;
}

export interface AuctionInstance {
  key: string | null;
  owner: string;
  displayName: string;
  bid: number;
  requirement: string;
  ask: number;
  deal: null | string | undefined;
  status?: string;
  type: string;
  lastCall: number;
}
