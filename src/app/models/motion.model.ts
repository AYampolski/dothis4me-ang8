export interface MotionInstance {
  key: string;
  owner: string;
  title: string;
  proposal: string;
  lastCall: number;
  ownerInfo?: string;
  displayName?: string;
  type?: string;
  status: number; //0 - started; 1 - completed ; 2 - rejected
}

export interface MotionAuctionItem {
  key: string;
  owner: string;
  displayName: string;
  requirement: string;
  bid: string;
  ask: string;
  deal: string | null | undefined;
}
