function convertToTex(chemicalFormulaStr) {
    let t1 = chemicalFormulaStr.replace(/([A-Z][a-z]*)(\d+)/g, "{$1}_{$2}")
    let t2 = t1.replace(/\^(\d*)([-*])/g, "^{$1$2}").replace(/\*/g, "+")
    return t2.replace(/\)(\d+)/g, ")_{$1}")
}