export interface AuctionForm {
    requirement: string;
    bid: number;
}

export interface AuctionInstance {
    key: string | null ;
    owner: string;
    displayName: string;
    bid: number;
    requirement: string;
    ask: number;
    deal: null | string | undefined;
    isAsked?: boolean;
}