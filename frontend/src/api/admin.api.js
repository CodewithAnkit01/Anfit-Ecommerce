    import api from "./axios";

    // DASHBOARD STATS
    export const getStats = () =>
    api.get("/admin/stats");