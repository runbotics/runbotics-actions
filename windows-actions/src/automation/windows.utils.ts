export const isValidJson = (value) => {
    try {
        JSON.parse(value);
        return true;
    } catch (error) {
        return false;
    }
};
