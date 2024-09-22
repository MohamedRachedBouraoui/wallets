
export type ORDRE_TRI = 'ASC' | 'DESC';
export type COMPTE = 'COMPTE_COURANT' | 'CARTE_CREDIT';
export const nameof = <T>(name: Extract<keyof T, string>): string => name;