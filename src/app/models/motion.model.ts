export class MotionInstance {
  key: string;
  owner: string;
  title: string;
  proposal: string;
  lastCall: number;
  displayName?: string;
  status: string;

  constructor(updatedItems: Partial<MotionInstance> | string) {
    if (typeof updatedItems === 'string') {
      this.status = updatedItems;
    } else {
      this.key = updatedItems.key;
      this.owner = updatedItems.owner;
      this.title = updatedItems.title;
      this.proposal = updatedItems.proposal;
      this.lastCall = updatedItems.lastCall;
      this.displayName = updatedItems.displayName;
      this.status = '0';
    }
  }
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
