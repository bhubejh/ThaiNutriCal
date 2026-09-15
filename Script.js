// Food information used by the calculator
var foods = {
  "Jasmine Rice": { emoji: "🍚", kcal: 130, protein: 2.7, carbs: 28.2, fat: 0.3 },
  "Chicken Breast": { emoji: "🍗", kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  "Pad Kra Pao": { emoji: "🌶️", kcal: 180, protein: 11, carbs: 10, fat: 10 },
  "Khao Pad": { emoji: "🍳", kcal: 190, protein: 6, carbs: 28, fat: 6 },
  "Tom Yum": { emoji: "🍜", kcal: 75, protein: 5, carbs: 6, fat: 3 },
  "Pad Thai": { emoji: "🍜", kcal: 170, protein: 6, carbs: 25, fat: 5 },
  "Khao Man Gai": { emoji: "🍗", kcal: 190, protein: 11, carbs: 22, fat: 7 },
  "Mango Sticky Rice": { emoji: "🥭", kcal: 160, protein: 2, carbs: 30, fat: 4 },
  "Egg": { emoji: "🥚", kcal: 143, protein: 12.6, carbs: 0.7, fat: 9.5 },
  "Morning Glory": { emoji: "🥬", kcal: 70, protein: 2, carbs: 7, fat: 4 }
};

var foodSelect = document.getElementById("foodSelect");
var amountInput = document.getElementById("amountInput");
var addFood = document.getElementById("addFood");
var mealList = document.getElementById("mealList");
var clearMeal = document.getElementById("clearMeal");
var message = document.getElementById("calcMessage");
var preview = document.getElementById("foodPreview");

var meal = [];

// Put all foods into the drop-down menu
if (foodSelect) {
  for (var name in foods) {
    var option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    foodSelect.appendChild(option);
  }

  foodSelect.onchange = function () {
    var food = foods[foodSelect.value];

    if (!food) {
      preview.innerHTML = "<span>🍽️</span><div><b>Pick a food above</b><small>Nutrition information will appear here.</small></div>";
    } else {
      preview.innerHTML = "<span>" + food.emoji + "</span><div><b>" +
        foodSelect.value + "</b><small>" + food.kcal +
        " kcal per 100g · Protein " + food.protein + "g</small></div>";
    }
  };
}

// Work out nutrition from the number of grams
function calculate(food, grams) {
  var amount = grams / 100;

  return {
    kcal: food.kcal * amount,
    protein: food.protein * amount,
    carbs: food.carbs * amount,
    fat: food.fat * amount
  };
}

function renderMeal() {
  if (!mealList) {
    return;
  }

  if (meal.length === 0) {
    mealList.innerHTML = '<div class="empty-state"><span>🍽️</span><b>Your plate is empty</b><small>Add a food to get started.</small></div>';
  } else {
    var html = "";

    for (var i = 0; i < meal.length; i++) {
      html += '<div class="meal-item">' +
        '<span class="meal-emoji">' + meal[i].emoji + '</span>' +
        '<div><b>' + meal[i].name + '</b><small>' + meal[i].grams +
        'g · ' + Math.round(meal[i].nutrition.kcal) + ' kcal</small></div>' +
        '<button onclick="removeFood(' + i + ')">×</button>' +
        '</div>';
    }

    mealList.innerHTML = html;
  }

  var totalCalories = 0;
  var totalProtein = 0;
  var totalCarbs = 0;
  var totalFat = 0;

  for (var j = 0; j < meal.length; j++) {
    totalCalories += meal[j].nutrition.kcal;
    totalProtein += meal[j].nutrition.protein;
    totalCarbs += meal[j].nutrition.carbs;
    totalFat += meal[j].nutrition.fat;
  }

  document.getElementById("totalCalories").textContent = Math.round(totalCalories);
  document.getElementById("totalProtein").textContent = totalProtein.toFixed(1) + "g";
  document.getElementById("totalCarbs").textContent = totalCarbs.toFixed(1) + "g";
  document.getElementById("totalFat").textContent = totalFat.toFixed(1) + "g";
}

function removeFood(index) {
  meal.splice(index, 1);
  renderMeal();
}

if (addFood) {
  addFood.onclick = function () {
    var name = foodSelect.value;
    var grams = Number(amountInput.value);

    if (!name) {
      message.textContent = "Choose a food first.";
      return;
    }

    if (!grams || grams <= 0) {
      message.textContent = "Enter an amount greater than 0 grams.";
      return;
    }

    meal.push({
      name: name,
      grams: grams,
      emoji: foods[name].emoji,
      nutrition: calculate(foods[name], grams)
    });

    message.textContent = name + " added to your meal.";
    amountInput.value = "";
    renderMeal();
  };
}

if (clearMeal) {
  clearMeal.onclick = function () {
    meal = [];
    message.textContent = "Meal cleared.";
    renderMeal();
  };
}

renderMeal();
