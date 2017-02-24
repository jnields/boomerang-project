export default function getQuery(params) {
    const queryParams  = [],
        keys = Object.keys(params);
    if (keys.length === 0) return "";
    keys.forEach(key => {
        if (!Array.isArray(params[key])) {
            params[key] = [params[key]];
        }
        [].push.apply(
            queryParams,
            params[key].map(
                param =>
                    encodeURIComponent(key)
                    + "=" + encodeURIComponent(param))
        );
    });
    return "?" + queryParams.join("&");
}
