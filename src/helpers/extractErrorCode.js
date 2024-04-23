const extractErrorCode = (str) => {
    const delimiter = '___';
    const firstOccurrence = str.indexOf(delimiter);
    if (firstOccurrence === -1) {
        return "An error occurred";
    }

    const secondOccurrence = str.indexOf(delimiter, firstOccurrence + delimiter.length);
    if (secondOccurrence === -1) {
        return "An error occurred";
    }
    return str.substring(firstOccurrence + delimiter.length, secondOccurrence);
}

export default extractErrorCode