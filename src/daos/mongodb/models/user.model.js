import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        age: { type: Number, required: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "user"], default: "user" },
        cart: [{ type: Schema.Types.ObjectId, ref: "Cart"}],
    },
    {
        timestamps: true,
    }
);

export const userModel = model("user", userSchema);