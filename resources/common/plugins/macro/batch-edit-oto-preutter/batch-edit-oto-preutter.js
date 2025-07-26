let selectedEntryIndexes = params["selector"]
let preutterance = params["preutterance"]
let overlap = params["overlap"]

if (debug) {
    console.log(`Input entries: ${entries.length}`)
    console.log(`Selected entries: ${selectedEntryIndexes.length}`)
}

for (let index of selectedEntryIndexes) {
    let entry = entries[index]
    let edited = Object.assign({}, entry)
    let offset = entry.points[3]
    let preutter = entry.points[1] - offset

    function tryParseInt(str) {
        const num = parseInt(str, 10);
        if (isNaN(num)) {
            return { success: false, value: null };
        }
        return { success: true, value: num };
    }

    let result = tryParseInt(preutterance);
    if (result.success) {
        let diff = 0;
        if (preutterance.startsWith("+") || preutterance.startsWith("-")) {
            diff = result.value;
        } else {
            diff = result.value - preutter;
        }
        console.log(`diff: ${diff}`)
        edited.points[3] = Math.max(entry.points[3] - diff, 0);
    }

    result = tryParseInt(overlap);
    if (result.success && result.value > 0) {
        preutter = entry.points[1] - edited.points[3];
        edited.points[2] = edited.points[3] + (preutter / result.value);
    }

    edited.start = Math.min(...edited.points, edited.start)

    if (debug) {
        console.log(`Edited: ${JSON.stringify(edited)}`)
    }
    entries[index] = edited
}
