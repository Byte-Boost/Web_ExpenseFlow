import { JwtPayload, jwtDecode } from 'jwt-decode';
import { NextRequest } from 'next/server';

interface MyJwtPayload extends JwtPayload {
  admin: boolean; 
}

export const isAuthenticatedAsAdmin = (req: NextRequest) => {
    const token = req.cookies.get('token')?.value
    if (!token) return false

    try {
        const decoded: any = jwtDecode(token);
        return decoded.admin === true
    } catch {
        return false
    }
}