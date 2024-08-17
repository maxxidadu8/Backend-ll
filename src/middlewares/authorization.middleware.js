// Middleware de autorización basado en roles de usuario
export const authorizations = (roles) => {
  return (req, res, next) => {
    // Muestra en consola el usuario autenticado
    console.log("Usuario autenticado:", req.user);
    
    // Verifica si el usuario está autenticado y tiene un rol permitido
    if (!req.user || !roles.includes(req.user.role)) {
      // Si no está autenticado o su rol no está permitido, muestra en consola un mensaje de acceso denegado
      console.log("Acceso denegado. Rol:", req.user ? req.user.role : "No definido");
      
      // Retorna una respuesta de error 403 (Prohibido) con un mensaje de "No autorizado"
      return res.status(403).json({ message: "No autorizado" });
    }
    
    // Si el usuario tiene un rol permitido, pasa al siguiente middleware o controlador
    next();
  };
};
