export function parseToNum(value) {
    if (value !== undefined) {
        value = parseInt(value, 10)
        if (isNaN(value)) {
            value = null;
        }
    }
    return value
}
export const generateId = function() {
    return Math.floor(Math.random() * 10000);
};