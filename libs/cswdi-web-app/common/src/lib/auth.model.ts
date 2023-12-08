import { userRole } from "@blavoss-cswdi/shared/api";

export interface authModel {
    email: string;
    exp: number;
    iat: number;
    sub: string;
    role: userRole;
}