import passport from "passport";
import local from "passport-local";
import jwtStrategy from "passport-jwt";
import { userModel } from "../daos/mongodb/models/user.model.js";
import { comparePassword } from "../utils/hash.js";
import { createHash } from "../utils/hash.js";

import { config } from "./config.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {
    // login strategy
    passport.use(
        'login', 
        new LocalStrategy(
            { 
                usernameField: 'email', 
                passReqToCallback: true
            } , 
            async (req, email, password, done) => {
                try {
                    const user = await userModel.findOne({ email });

                    if (!user) {
                        return done(null, false, { message: 'Usuario no encontrado' });
                    }

                    if (!(await comparePassword(password, user.password))) {
                        return done(null, false, { message: 'Contraseña incorrecta' });
                    }

                    return done(null, user);

                } catch (error) {
                    return done(error, false, { message: 'Error al autenticar' });
                }
            }
        )
    );

    passport.use(
        "register",
        new LocalStrategy(
            {
                usernameField: "email",
                passReqToCallback: true,
            },
            async (req, email, password, done) => {
                try {
                const { first_name, last_name, age } = req.body;
        
                const userExists = await userModel.findOne({ email });
        
                if (userExists) {
                    return done(null, false, { message: "El usuario ya existe" });
                }
        
                const hashPassword = await createHash(password);
        
                const user = await userModel.create({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: hashPassword,
                });
        
                return done(null, user);
                } catch (error) {
                done(error);
                }
            }
            )
        );

        passport.use(
            "jwt",
            new JWTStrategy(
                {
                    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
                    secretOrKey: config.JWT_SECRET,
                },
                async (payload, done) => {
                    try {
                        const user = await userModel.findOne({ email: payload.email });
        
                        if (!user) {
                            return done(null, false, { message: "No se encontró el usuario" });
                        }
        
                        return done(null, user);
        
                    } catch (error) {
                        done(error);
                    }
                }
            )
        );
        
}

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, false, { message: 'Error al deserializar usuario' });
    }
});
    
function cookieExtractor(req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["token"];
    }
        
    return token;
}

export { initializePassport };  