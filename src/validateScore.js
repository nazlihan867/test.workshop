/**
* Validiert und bewertet eine Punktzahl basierend auf verschiedenen
Kriterien.
*
* @param {number} score - Die zu validierende Punktzahl (0-100)
* @param {Object} options - Optionale Konfiguration
* @param {number} options.passingScore - Mindestpunktzahl zum
Bestehen (Standard: 60)
* @param {boolean} options.strictMode - Ob strenge Validierung
angewendet werden soll (Standard: false)
* @param {string[]} options.bonusCategories - Kategorien, die
Bonuspunkte geben (optional)
* @returns {Object} Ergebnis der Validierung
*/
function validateScore(score, options = {}) {
    // Standardwerte festlegen
    const passingScore = options.passingScore ?? 60;
    const strictMode = options.strictMode ?? false;
    const bonusCategories = options.bonusCategories || [];
    // Ergebnisobjekt
    const result = {
    valid: true,
    score: score,
    passed: false,
    grade: '',
    errors: []
    };
    // Basisvalidierung
    if (score === undefined || score === null) {
    result.valid = false;
    result.errors.push('Score ist erforderlich');
    return result;
    }
    if (typeof score !== 'number') {
    result.valid = false;
    result.errors.push('Score muss eine Zahl sein');
    return result;
    }
    if (score < 0 || score > 100) {
    result.valid = false;
    result.errors.push('Score muss zwischen 0 und 100 liegen');
    return result;
    }
    // Strikte Validierung
    if (strictMode) {
    if (Number.isNaN(score) || !Number.isFinite(score)) {
    result.valid = false;
    result.errors.push('Score muss eine gültige Zahl sein');
    return result;
    }
    if (!Number.isInteger(score)) {
    result.valid = false;
    result.errors.push('Score muss eine ganze Zahl sein');
    return result;
    }
    }
    // Bonus-Punkte hinzufügen (maximal 10 Zusatzpunkte)
    let finalScore = score;
    if (bonusCategories.length > 0) {
    const bonusPoints = Math.min(bonusCategories.length * 2, 10);
    finalScore = Math.min(finalScore + bonusPoints, 100);
    result.score = finalScore;
    }
    // Bestandsprüfung
    result.passed = finalScore >= passingScore;
    // Notenberechnung
    if (finalScore >= 90) {
    result.grade = 'A';
    } else if (finalScore >= 80) {
    result.grade = 'B';
    } else if (finalScore >= 70) {
    result.grade = 'C';
    } else if (finalScore >= 60) {
    result.grade = 'D';
    } else {
    result.grade = 'F';
    }
    return result;
    }
    export { validateScore };