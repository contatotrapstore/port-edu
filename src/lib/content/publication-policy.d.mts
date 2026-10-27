export type PublicationAsset={id:string;sha256:string;kind:string;object_key:string;provenance:{slide?:number;qa?:string;format?:string;width?:number;height?:number;duration?:number}};
export function fingerprint(assets:PublicationAsset[]):string;
export function publicationEligibility(input:{revisionId:string;activeRevision:string;slides:string[];assets:PublicationAsset[];expectedFingerprint:string;review:{decision:string;assetFingerprint?:string}|null;mode:string;format?:string}):string|null;
export function refreshDue(connection:{expires_at?:Date|string;refreshed_at?:Date|string;verified_at?:Date|string},now?:number):boolean;
