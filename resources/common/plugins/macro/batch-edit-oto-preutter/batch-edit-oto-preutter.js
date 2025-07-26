let selectedEntryIndexes = params["selector"]
let preutterance = params["preutterance"]
let overlap = params["overlap"]

let nameTexts = [
    ["offset", ["Offset", "左边界", "左ブランク"]],
    ["fixed", ["Fixed", "固定", "固定範囲"]],
    ["overlap", ["Overlap", "重叠", "オーバーラップ"]],
    ["preutterance", ["Preutterance", "先行发声", "先行発声"]],
    ["cutoff", ["Cutoff", "右边界", "右ブランク"]],
]

if (debug) {
    console.log(`Input entries: ${entries.length}`)
    console.log(`Selected entries: ${selectedEntryIndexes.length}`)
}

for (let index of selectedEntryIndexes) {
    let entry = entries[index]
    let edited = Object.assign({}, entry)

    function tryParseInt(str) {
        const num = parseInt(str, 10);
        if (isNaN(num)) {
            return { success: false, value: null };
        }
        return { success: true, value: num };
    }

    const result = tryParseInt(preutterance);
    if (result.success) {
        let diff = 0;
        if (preutterance.StartsWith("+") || preutterance.StartsWith("-")) {
            diff = result.value;
        } else {
            diff = result.value - entry.points[1];
        }
        // offset
        edited.points[3] = Math.max(entry.points[3] - diff, 0);
        // fixed
        edited.points[0] = entry.points[0] + diff;
        // preutterance
        edited.points[1] = entry.points[1] + diff;
        // overlap
        edited.points[2] = entry.points[2] + diff;
        // cutoff
        if (newValue < 0) {
            edited.end = entry.end - diff;
        } else {
            edited.end = Math.max(entry.end - diff, 0);
        }
    }

    result = tryParseInt(overlap);
    if (result.success && result.value > 0) {
        edited.points[2] = edited.points[1] / result.value;
    }

    edited.start = Math.min(...edited.points, edited.start)

    if (debug) {
        console.log(`Edited: ${JSON.stringify(edited)}`)
    }
    entries[index] = edited
}
