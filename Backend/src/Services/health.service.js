/**
 * Health Service
 * Rule-Based health analysis for product nutrition facts.
 * Do NOT use ChatGPT, Gemini, or any AI.
 */

function analyzeNutrition(nutrition) {
  const pros = [];
  const cons = [];
  const warnings = [];
  let recommendations = "Suitable for regular consumption as part of a balanced diet.";

  const sugar = parseFloat(nutrition.sugar || 0);
  const fat = parseFloat(nutrition.fat || 0);
  const protein = parseFloat(nutrition.protein || 0);
  const fiber = parseFloat(nutrition.fiber || 0);
  const salt = parseFloat(nutrition.salt || 0);
  const sodium = parseFloat(nutrition.sodium || 0); // note: sodium is often in mg, but we check if the user specifies >500mg. We will check the unit. If the input is already clean and normalized, we use the raw value. Let's make sure our service handles clean numbers where sodium is in mg.

  // Base score
  let score = 70; // start neutral

  // 1. Sugar Rule
  if (sugar > 15) {
    score -= 25;
    cons.push("High Sugar");
    warnings.push("High sugar content. Not suitable for diabetic individuals.");
  } else if (sugar > 0 && sugar <= 5) {
    pros.push("Low Sugar");
  }

  // 2. Fat Rule
  if (fat > 20) {
    score -= 20;
    cons.push("High Fat");
    warnings.push("High fat content. Limit consumption if monitoring cholesterol.");
  } else if (fat > 0 && fat <= 3) {
    pros.push("Low Fat");
  }

  // 3. Protein Rule
  if (protein > 10) {
    score += 15;
    pros.push("Good Protein Source");
  }

  // 4. Fiber Rule
  if (fiber > 5) {
    score += 15;
    pros.push("High Fiber");
  }

  // 5. Salt Rule
  if (salt > 1.5) {
    score -= 20;
    cons.push("High Salt");
    warnings.push("High salt content. May affect blood pressure.");
  }

  // 6. Sodium Rule
  if (sodium > 500) {
    score -= 15;
    cons.push("High Sodium");
    if (!warnings.includes("May affect blood pressure.")) {
      warnings.push("High sodium content. Consume in moderation.");
    }
  }

  // Cap score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Determine health grade/status
  let status = "Moderate";
  if (score > 70) {
    status = "Healthy";
    recommendations = "Excellent choice for daily nutrition. High in positive nutrients.";
  } else if (score < 45) {
    status = "Unhealthy";
    recommendations = "Consume occasionally. Not recommended for daily diet. High in sugar, fat, or sodium.";
  } else {
    status = "Moderate";
    recommendations = "Consume in moderation as part of a varied and active lifestyle.";
  }

  // Specific diabetic warning recommendation
  if (sugar > 15) {
    recommendations = "Consume occasionally. Not suitable for diabetic people.";
  }

  return {
    score,
    status,
    pros,
    cons,
    warnings,
    recommendations
  };
}

module.exports = { analyzeNutrition };
