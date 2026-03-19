import { verifyToken } from "vedaxon-auth-framework";

export default function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];

    // Use framework to decode & validate token
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Attach user to request
    req.user = {
        id: decoded.id,          // ✔ same as before
        tenantId: decoded.tenantId,  // ✔ multi-tenant support stays
        role: decoded.role,          // ✔ RBAC stays
    };

    next();
}
