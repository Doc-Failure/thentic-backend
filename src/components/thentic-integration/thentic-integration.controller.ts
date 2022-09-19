import { Application, NextFunction, Request, Response } from 'express';
import * as responsehandler from '../../lib/response-handler';
import BaseApi from '../BaseApi';
import ThenticApiCalls from './thentic-api-calls';
/**
 *  Thentic Integration controller
 */
export default class MigrationApiController extends BaseApi {

    constructor(express: Application) {
        super();
        this.register(express);
    }

    public register(express: Application): void {
        express.use('/api/v1', this.router);
        this.router.get('/deleteNft', this.deleteNft);
        this.router.get('/createNftContract', this.createNft);
        this.router.get('/mintNft', this.mintNft);
    }

    public async deleteNft(req: Request, res: Response, next: NextFunction): Promise<void>  {
        const to_address='0xdead000000000000000042069420694206942069';
        const from_chain_id:number = parseInt(req.query.from_chain_id as string, 10);  
        const contract_address:string = req.query.contract_address as string;
        const nft_id:string = req.query.nft_id as string;
        const from_address:string = req.query.from_address as string;
        try {
            const thenticCaller=new ThenticApiCalls();
            const result:string=await thenticCaller.transferNft(from_chain_id, contract_address, from_address, to_address,nft_id);
           
            const response={ transaction_url:result };
            res.locals.data = response;
            responsehandler.send(res);
        }catch (err) {
            next(err);
        }
    }

    public async createNft(req: Request, res: Response, next: NextFunction): Promise<void> {
        const chain_id:number = parseInt(req.query.chain_id as string, 10);  
        const name:string = req.query.name as string;
        const short_name:string = req.query.short_name as string;
        
        try {
            const thenticCaller=new ThenticApiCalls();
            const result= await thenticCaller.createNftContract(chain_id, name, short_name);

            const response={ transaction_url:result };
            res.locals.data = response;
            responsehandler.send(res);
        }catch (err) {
            next(err);
        }
    }

    
    public async mintNft(req: Request, res: Response, next: NextFunction): Promise<void> {
        const chain_id:number = parseInt(req.query.chain_id as string, 10);  
        const contract_address:string = req.query.contract_address as string;
        const nft_id:string = req.query.nft_id as string;
        const nft_data:string = req.query.nft_data as string;
        const to_address:string = req.query.to_address as string;

        try {
            const thenticCaller=new ThenticApiCalls();
            const result= await thenticCaller.mintNft(chain_id, contract_address, nft_id, nft_data, to_address);

            const response={ transaction_url:result };
            res.locals.data = response;
            responsehandler.send(res);
        }catch (err) {
            next(err);
        }

    }
}
