
export interface INft {
    contract_address:string;
    nft_id:number;
    from_address:string;
    to_address:string;
}

export interface ITransferNftBody {
    key:string,
    chain_id:number,
    contract:string,
    nft_id:string,
    from:string,
    to:string
}

export interface ICreateNftContractBody{
    key: string,
    chain_id: number,
    name: string,
    short_name: string
}

export interface IMintNft{
    key:string,
    chain_id:number,
    contract:string,
    nft_id:string,
    nft_data:string,
    to:string
}