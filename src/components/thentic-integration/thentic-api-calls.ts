import axios from 'axios';
import { ICreateNftContractBody, IMintNft, ITransferNftBody } from './thentic-integration.types';

/**
 *  Thentic Integration controller
 */
export default class ThenticApiCalls{
    baseUrl='https://thentic.tech/api';

    public async transferNft(chain_id:number, contract_address:string, from_address:string, to_address:string,nft_id:string):Promise<string>{
        let url:string;
        
        const data:ITransferNftBody = {
            key:environment.thenticKey,
            chain_id,
            contract:contract_address,
            nft_id,
            from:from_address,
            to:to_address
        };
        
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            url: `${this.baseUrl}/nfts/transfer`,
            data: JSON.stringify(data)
          };
          
          try {
            url = await axios.request(options).then((response) => response.data.transaction_url);
        } catch (err) {
            console.log(err);
        }
        return url;
    }

    
    public async createNftContract(chain_id:number, contract_name:string, contract_short_name:string):Promise<string>{
        let url:string;
        const data:ICreateNftContractBody = {
            key:environment.thenticKey,
            chain_id,
            name:contract_name,
            short_name:contract_short_name
        };
        
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            url: `${this.baseUrl}/nfts/contract`,
            data: JSON.stringify(data)
          };
          
        try {
            url = await axios.request(options).then((response) => response.data.transaction_url);
        } catch (err) {
            console.log(err);
        }
        return url;
    }

    
    public async mintNft(chain_id:number, contract_address:string, nft_id:string, nft_data:string, to_address:string):Promise<string>{
        let url:string;
        const data:IMintNft = {
            key:environment.thenticKey,
            chain_id,
            contract:contract_address,
            nft_id,
            nft_data,
            to:to_address
        };
        
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            url: `${this.baseUrl}/nfts/mint`,
            data: JSON.stringify(data)
          };
          
        
        try {
            url = await axios.request(options).then((response) => response.data.transaction_url);
        } catch (err) {
            console.log(err);
        }

        return url;
    }
}
