const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(403).send("Unauthorized");
        if (!allowedRoles.includes(req.user.role)) return res.status(403).send("");
        next();
    }
}

export { authorize }