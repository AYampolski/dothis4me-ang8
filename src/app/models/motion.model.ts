export interface MotionInstance {
    key: string;
    owner: string;
    title: string;
    proposal: string;
    lastCall: number;
    ownerInfo?: string;
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

export interface AuctionUpdateByMotionCreator {
    ask: string;
    deal: string | null | undefined;
}

export interface AuctionUpdateByAuctionCreator {
    bid: string;
}
