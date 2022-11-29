export interface IWalletVar {
    id: string;
}
export interface IDepositedPools {
    users: {
        deposits: Array<string>
    }[];
}
export interface poolVar {
    id: string;
}
export interface ICoolPoolInfo {
    coolPools: {
        totalCO2Offset: BigInt,
        totalTxCovered: BigInt,
        totalDepositorCount: number,
        greenToken: string
    }[];
}
export interface ICreatorPools {
    coolPools: {
        id: string;
    }[];
}

export interface IPoolData  {
    offset: BigInt;
    transactions: BigInt;
    greenToken: string;   
}