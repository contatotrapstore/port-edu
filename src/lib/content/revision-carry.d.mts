export function isManualOnly(brief:{production?:string}|null|undefined):boolean;
export function importedBriefFields(brief:Record<string,unknown>|null|undefined):Record<string,unknown>;
export function carriesImportedMedia(previous:{brief:{production?:string;format?:string}&Record<string,unknown>;slides:string[]}|undefined,input:{format?:string;slides:string[]}):boolean;
export function copiedAssetPlan<P extends Record<string,unknown>>(assets:{id:string;kind:string;object_key:string;sha256:string;provenance:P}[],revisionId:string):{from:string;to:string;kind:string;sha256:string;provenance:P&{copied_from:string}}[];
