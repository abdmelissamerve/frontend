import { defineAbility } from "@casl/ability";

export default (user) =>
    defineAbility((can) => {
        if (!user) return;
        if (user.role === "user") {
            can("manage", "all");
        }
        if (user.role === "technician") {
            can("read", "Technician-Dashboard");
            can("read", "Technician-Menu");
        }
    });
