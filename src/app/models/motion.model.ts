export interface MotionForm {
  title: string;
  proposal: string;
  lastCall: number;
}

export interface MotionInstance {
  key: string;
  owner: string;
  title: string;
  proposal: string;
  lastCall: number;
  ownerInfo?: string;
  displayName?: string;
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
