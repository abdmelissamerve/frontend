import { defineAbility } from "@casl/ability";

export default (user) =>
    defineAbility((can) => {
        if (!user) return;
        if (user.role === "admin") {
            can("manage", "all");
        }
        if (user.role === "user") {
            can("read", "Technician-Dashboard");
            can("read", "Technician-Menu");
        }
    });
