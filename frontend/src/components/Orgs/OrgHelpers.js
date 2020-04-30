export function getRoleIconClassName(role) {
    var ret = "";

    if (role === "ORG_OWNER") {
        ret = "text-owner fas fa-gem";
    } else if (role === "ADMIN") {
        ret = "text-admin far fa-gem";
    } else if (role === "TEAM_LEADER") {
        ret = "text-leader far fa-gem";
    }
    return ret;
}

