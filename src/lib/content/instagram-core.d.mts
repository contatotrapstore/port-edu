export const GRAPH_VERSION:string;
export const EXPECTED_ACCOUNT:string;
export function encryptToken(token:string,key:string|undefined):string;
export function decryptToken(value:string,key:string|undefined):string;
export function instagramRequest(token:string,endpoint:string,params?:Record<string,string>,method?:string,transport?:typeof fetch):Promise<Record<string,unknown>>;
export function verifyInstagram(token:string,transport?:typeof fetch):Promise<{id:string;username:string;quota:unknown}>;
