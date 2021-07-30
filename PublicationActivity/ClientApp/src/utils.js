export function format(source, ...args) {
    let result = source;
    for (let k in args) {
        result = result.replace("{" + k + "}", args[k])
    }
    return result;
};
