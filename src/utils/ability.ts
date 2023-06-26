import { defineAbility } from "@casl/ability";

export default (user) =>
    defineAbility((can) => {
        if (!user) return;
        if (user.role === "admin") {
            can("manage", "all");
        }
        if (user.role === "user") {
            can("manage", "User-Dashboard");
            can("manage", "User-Menu");
            can("manage", "User-Projects");
            can("manage", "User-Tasks");
        }
    });
