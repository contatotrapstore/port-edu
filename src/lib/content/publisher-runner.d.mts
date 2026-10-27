export function runPublisher(env:Record<string,string|undefined>,source:'local'|'cloud'):Promise<{state:string;error?:string}>;
