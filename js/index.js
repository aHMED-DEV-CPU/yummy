"use strict";
// start loader
$(document).ready(() => {
    $(".outer-loader").fadeOut(1000, () => {
        $("body").css("overflow", "auto")
    });
});
async function showLoader() {
    $(".outer-loader").fadeIn(() => {
        $("body").css("overflow", "hidden")
    });
}

async function hideLoader() {
    $(".outer-loader").fadeOut(() => {
        $("body").css("overflow", "auto")
    });
}
// End loader
// Start sidebar moving 
$(".closing-opening").on("click", ".fa-sliders", (e) => {
    $(e.target).addClass("fa-xmark").removeClass("fa-sliders");
    $(".sidebar").animate({ left: '0' }, 500);
    $("#links li").eq(0).animate({ top: '0' }, 500);
    $("#links li").eq(1).animate({ top: '0' }, 600)
    $("#links li").eq(2).animate({ top: '0' }, 700)
    $("#links li").eq(3).animate({ top: '0' }, 800)
    $("#links li").eq(4).animate({ top: '0' }, 900)
});
$(".closing-opening").on("click", ".fa-xmark", (e) => {
    $(e.target).addClass("fa-sliders").removeClass("fa-xmark");
    $(".sidebar").animate({ left: '-210px' }, 500);
    $("#links li").eq(4).animate({ top: '200px' }, 500);
    $("#links li").eq(3).animate({ top: '200px' }, 600)
    $("#links li").eq(2).animate({ top: '200px' }, 700)
    $("#links li").eq(1).animate({ top: '200px' }, 800)
    $("#links li").eq(0).animate({ top: '200px' }, 900)
});

// End sidebar moving 
// start first page
let container = $("#data")
// main object
class search {
    constructor(method, searchClassifying, searchBy) {
        this.method = method
        this.classifying = searchClassifying
        this.by = searchBy
    }
    getData = async () => {
        try {
            await showLoader()
            let response = await fetch(`https://www.themealdb.com/api/json/v1/1/${this.method}.php?${this.classifying}=${this.by}`)
            let result = await response.json()
            await hideLoader()
            return result.meals
        }
        catch {
            console.log("error");
        }
    }
}
// end main object
// first page container
async function mainPage() {
    try {
        await showLoader();
        let mainData = new search("search", "s", " ");
        let data = await mainData.getData();
        container.empty();
        for (let i = 0; i < data.length; i++) {
            container.append(`
                <div class="col-sm-6 col-md-4 col-lg-3 rounded-2">
                    <div class="meal-box rounded-2 overflow-hidden" id="${data[i].idMeal}">
                        <img src="${data[i].strMealThumb}" alt="" class="img-fluid">
                        <div class="img-layer ps-2">
                            <h2>${data[i].strMeal}</h2>
                        </div>
                    </div>
                </div>
            `);
        }
        await hideLoader();
    } catch (error) {
        console.log("Error fetching data:", error);
        await hideLoader();
    }
}
mainPage()
// end first  page container
// start   page details
$("#data").on("click", ".meal-box", async (e) => {
    try {
        await showLoader();
        let detailsData = new search("lookup", "i", $(e.currentTarget).attr("id"))
        let details = await detailsData.getData()
        container.empty()
        for (let i = 0; i < details.length; i++) {
            let strIngredient = [];
            let strMeasure = []
            let strTags = []
            for (let j = 1; j <= 20; j++) {
                let ingredient = details[i][`strIngredient${j}`];
                let measure = details[i][`strMeasure${j}`]
                if (ingredient && ingredient.trim() && measure && measure.trim() !== "") {
                    strIngredient.push(ingredient);
                    strMeasure.push(measure)
                }
            }
            if (details[i].strTags == null) {
                strTags.push("there are no Tags");
            }
            else {
                for (let j = 0; j < details[i].strTags.split(",").length; j++) {
                    let tags = details[i].strTags.split(",")[j];
                    if (tags && tags.trim() !== "") {
                        strTags.push(tags);
                    }
                }
            }
            let html = `                                <div class="x-icon  text-end text-white  cursor-pointer"><i class="fa-solid fa-x  fs-3"></i></div>
                <div class="col-md-4">
                    <div class="image-box rounded-3 overflow-hidden">
                        <img src="${details[i].strMealThumb}" class=" img-fluid" alt="">
                    </div>
                    <h2 class=" text-white mt-2">${details[i].strMeal}</h2>
                </div>
                <div class="col-md-8 details">
                    <h2 class=" text-white">Instructions</h2>
                    <p class=" text-white">${details[i].strInstructions}</p>
                    <h3 class=" text-white"><span>Area : </span><span>${details[i].strArea}</span></h3>
                    <h3 class=" text-white"><span>Category : </span><span>${details[i].strCategory}</span></h3>
                    <h3 class=" text-white"><span>Recipes : </span>
                        <ul class=" d-flex flex-wrap ps-0" id="recipes">
`
            for (let i = 0; i < strIngredient.length; i++) {
                html += `
                <li>${strMeasure[i]} ${strIngredient[i]}</li>
            `;
            }
            html += `
                </ul>
            </h3>
                        <h3 class=" text-white"><span class=" d-block">tags : </span>
            `
            for (let i = 0; i < strTags.length; i++) {
                html += `
                <span class=" tag  d-inline-block">${strTags[i]}</span>
            `;
            }
            html += `
            </h3>
            <a href="${details[i].strSource}" target="_blank" class=" me-2 btn btn-success">Source</a>
            <a href="${details[i].strYoutube}" target="_blank" class=" btn btn-danger">Youtube</a>
        </div>`
            container.append(html);
        }
        await hideLoader();
    } catch (error) {
        console.log("Error fetching details:", error);
        await hideLoader();
    }
});
$("#data").on("click", ".x-icon", async (e) => {
    container.empty();
    await mainPage();
});
// End   page details
// search 
$("#Search").click(function (e) {
    showLoader()
    container.empty()
    $("#searchPage").removeClass("d-none")
    $("#contactPage").addClass("d-none");
    hideLoader()
});
$("#byName").on("input", async (e) => {
    let entry = $("#byName").val().trim()
    try {
        await showLoader()
        if (entry === "") {
            container.empty();
        }
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${entry}`)
        let result = await response.json()
        let mealsData = result.meals
        container.empty();
        if (mealsData) {
            mealsData.forEach((meal) => {
                container.append(`
                    <div class="col-sm-6 col-md-4 col-lg-3 rounded-2">
                        <div class="meal-box rounded-2 overflow-hidden" id="${meal.idMeal}">
                            <img src="${meal.strMealThumb}" alt="" class="img-fluid">
                            <div class="img-layer ps-2">
                                <h2>${meal.strMeal}</h2>
                            </div>
                        </div>
                    </div>
                `);
            });
        } else {
            console.log("No meals found");
        }
        await hideLoader()
    }
    catch {
        await hideLoader()
        console.log("error");
        container.empty()
    }
    $("#data").on("click", ".meal-box", () => {
        $("#searchPage").addClass("d-none")
        $("#contactPage").addClass("d-none");
    })
    hideLoader()
});
$("#byLetter").on("input", async (e) => {
    let entry = $("#byLetter").val().trim()
    try {
        await showLoader()
        if (entry === "") {
            container.empty();
        }

        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${entry}`)
        let result = await response.json()
        let mealsData = result.meals
        container.empty();
        if (mealsData) {
            mealsData.forEach((meal) => {
                container.append(`
                    <div class="col-sm-6 col-md-4 col-lg-3 rounded-2">
                        <div class="meal-box rounded-2 overflow-hidden" id="${meal.idMeal}">
                            <img src="${meal.strMealThumb}" alt="" class="img-fluid">
                            <div class="img-layer ps-2">
                                <h2>${meal.strMeal}</h2>
                            </div>
                        </div>
                    </div>
                `);
            });
        } else {
            console.log("No meals found");
        }
        await hideLoader()
    }
    catch {
        await hideLoader()
        console.log("error");
        container.empty()
    }
    $("#data").on("click", ".meal-box", () => {
        $("#searchPage").addClass("d-none")
        $("#contactPage").addClass("d-none");
    })
});
// Categories
$("#Categories").click(function (e) {
    showLoader()
    $("#searchPage").addClass("d-none")
    container.empty()
    async function showAllCateg() {
        try {
            let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
            let result = await response.json()
            let allCat = result.categories
            for (let i = 0; i < allCat.length; i++) {
                container.append(`                <div class="  col-sm-6 col-md-4 col-lg-3 rounded-2 " >
                    <div class="category-box rounded-2 overflow-hidden" id="${allCat[i].strCategory}">
                        <img src="${allCat[i].strCategoryThumb}" alt="" class=" img-fluid">
                        <div class="img-layer  ">
                            <h3 >${allCat[i].strCategory}</h3>
                            <p>${allCat[i].strCategoryDescription.split(" ").slice(0, 18).join(" ")}</p>
                        </div>
                    </div>
                </div>`)
            }
        } catch {
            console.log("error");
        }
    }
    showAllCateg()
    hideLoader()
})
$("#main").on("click", ".category-box", async (e) => {
    showLoader()
    let endPath = $(e.currentTarget).attr("id");

    container.empty()
    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${endPath}`)
        let result = await response.json()
        let meals = result.meals
        for (let i = 0; i < meals.length; i++) {
            container.append(`                <div class="  col-sm-6 col-md-4 col-lg-3 rounded-2 " >
                    <div class="meal-box rounded-2 overflow-hidden" id="${meals[i].idMeal}">
                        <img src="${meals[i].strMealThumb}" alt="" class=" img-fluid">
                        <div class="img-layer  ps-2">
                            <h2>${meals[i].strMeal}</h2>
                        </div>
                    </div>
                </div>`)
        }
    } catch {
        console.log("error");
    }
    hideLoader()
});
// area 
$("#Area").click(function (e) {
    showLoader()
    $("#searchPage").addClass("d-none")
    container.empty()
    async function showAllArea() {
        try {
            let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
            let result = await response.json()
            let allArea = result.meals
            for (let i = 0; i < allArea.length; i++) {
                container.append(`                <div class="  col-sm-6 col-md-4 col-lg-3 rounded-2 " >
                    <div class="area text-center cursor-pointer" id="${allArea[i].strArea}">
                        <i class="fa-solid fa-house-laptop text-white"></i>
                        <div class="img-layer  ">
                            <h3 >${allArea[i].strArea}</h3>
                        </div>
                    </div>
                </div>`)
            }
        } catch {
            console.log("error");
        }
    }
    showAllArea()
    hideLoader()
})
$("#main").on("click", ".area", async (e) => {
    showLoader()
    let endPath = $(e.currentTarget).attr("id");
    container.empty()
    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${endPath}`)
        let result = await response.json()
        let meals = result.meals
        for (let i = 0; i < meals.length; i++) {
            container.append(`                <div class="  col-sm-6 col-md-4 col-lg-3 rounded-2 " >
                    <div class="meal-box rounded-2 overflow-hidden" id="${meals[i].idMeal}">
                        <img src="${meals[i].strMealThumb}" alt="" class=" img-fluid">
                        <div class="img-layer  ps-2 ">
                            <h5>${meals[i].strMeal}</h5>
                        </div>
                    </div>
                </div>`)
        }
    }
    catch {
        console.log("error");
    }
    hideLoader()
});
// Ingredients
$("#Ingredients").click(function (e) {
    showLoader()
    $("#searchPage").addClass("d-none")
    container.empty()
    async function showAllIngredients() {
        try {
            let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
            let result = await response.json()
            let allIngredients = result.meals
            for (let i = 0; i < 25; i++) {
                container.append(`                <div class="  col-sm-6 col-md-4 col-lg-3 rounded-2 " >
                    <div class="ingredients text-center cursor-pointer" id="${allIngredients[i].strIngredient}">
                        <i class="fa-solid fa-drumstick-bite text-white"></i>
                        <div class="img-layer  ">
                            <h3 >${allIngredients[i].strIngredient}</h3>
                            <p>${allIngredients[i].strDescription.split(" ").slice(0, 18).join(" ")}</p>
                        </div>
                    </div>
                </div>`)
            }
        } catch {
            console.log("error");
        }
    }
    showAllIngredients()
    hideLoader()
})
$("#main").on("click", ".ingredients", async (e) => {
    showLoader()
    let endPath = $(e.currentTarget).attr("id");
    container.empty()
    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${endPath}`)
        let result = await response.json()
        let meals = result.meals
        for (let i = 0; i < meals.length; i++) {
            container.append(`                <div class="  col-sm-6 col-md-4 col-lg-3 rounded-2 " >
                    <div class="meal-box rounded-2 overflow-hidden" id="${meals[i].idMeal}">
                        <img src="${meals[i].strMealThumb}" alt="" class=" img-fluid">
                        <div class="img-layer  ps-2 ">
                            <h5>${meals[i].strMeal}</h5>
                        </div>
                    </div>
                </div>`)
        }
    }
    catch {
        console.log("error");
    }
    hideLoader()
});
//contact 
let nameInput, EmailInput, PhoneInput, ageInput, passwordInput, rePasswordInput;
let isNameValid = false;
let isEmailValid = false;
let isPhoneValid = false;
let isAgeValid = false;
let isPasswordValid = false;
let isRePasswordValid = false;
$("#Contact").click(function (e) {
    showLoader()
    $("#searchPage").addClass("d-none")
    container.empty()
    $("#contactPage").removeClass("d-none");
    container.append(`     
                    <div class="name-input col-md-6">
                <input type="text" class="  form-control bg-black text-white" placeholder="Enter Your Name" name="Name" id="name">
                    <div class=" w-100 p-2 alert  text-center mt-3 d-none">Special characters and numbers not allowed</div>
            </div>
            <div class="letter-input col-md-6">
                <input type="email" class="  form-control bg-black text-white" 
                    placeholder="Enter Your Email "  name="email" id="email">
                    <div class=" w-100 p-2 alert  text-center mt-3 d-none ">Email not valid *exemple@yyy.zzz</div>
            </div>
            <div class="letter-input col-md-6">
                <input type="text" class="  form-control bg-black text-white" 
                    placeholder="Enter Your Phone"   name="phone" id="phone">
                    <div class=" w-100 p-2 alert  text-center mt-3 d-none">Enter valid Phone Number</div>
                    
            </div>
            <div class="letter-input col-md-6">
                <input type="number" class="  form-control bg-black text-white" 
                    placeholder="Enter Your Age" name="age" id="age">
                <div class=" w-100 p-2 alert  text-center mt-3 d-none">Enter valid age</div>
            </div>
            <div class="letter-input col-md-6">
                <input type="password" class="  form-control bg-black text-white" 
                    placeholder="Enter Your Password" name="password" id="pass">
                <div class=" w-100 p-2 alert  text-center mt-3 d-none">Enter valid password *Minimum eight characters, at least one letter and one number:*</div>
            </div>
            <div class="letter-input col-md-6">
                <input type="password" class="  form-control bg-black text-white" 
                    placeholder="Repassword" name="repassword" id="repass">
                <div class=" w-100 p-2 alert  text-center mt-3 d-none">Enter valid repassword</div>
            </div>
            <button type="button" class="btn btn-outline-danger" disabled id="submitButton">Submit</button> `
    )
    initializeInputs()
    hideLoader()
})
function initializeInputs() {
    nameInput = $("#name");
    EmailInput = $("#email");
    PhoneInput = $("#phone");
    ageInput = $("#age");
    passwordInput = $("#pass");
    rePasswordInput = $("#repass");
    nameInput.on("input", validateName);
    EmailInput.on("input", validateEmail);
    PhoneInput.on("input", validatePhone);
    ageInput.on("input", validateAge);
    passwordInput.on("input", validatePassword);
    rePasswordInput.on("input", validateRePassword);
}
function validateName() {
    var regex = /^[^ ][a-z ]{0,}$/gmi;
    if (regex.test(nameInput.val())) {
        nameInput.addClass("is-valid").removeClass("is-invalid");
        $("#name + .alert").addClass("d-none");
        isNameValid = true;
    } else {
        nameInput.addClass("is-invalid").removeClass("is-valid");
        $("#name + .alert").removeClass("d-none");
        isNameValid = false;
    }
    changeBtn();
}
function validateEmail() {
    var regex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]{2,}/gm;
    if (regex.test(EmailInput.val())) {
        EmailInput.addClass("is-valid").removeClass("is-invalid");
        $("#email + .alert").addClass("d-none");
        isEmailValid = true;
    } else {
        EmailInput.addClass("is-invalid").removeClass("is-valid");
        $("#email + .alert").removeClass("d-none");
        isEmailValid = false;
    }
    changeBtn();
}
function validatePhone() {
    var regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/gm;
    if (regex.test(PhoneInput.val())) {
        PhoneInput.addClass("is-valid").removeClass("is-invalid");
        $("#phone + .alert").addClass("d-none");
        isPhoneValid = true;
    } else {
        PhoneInput.addClass("is-invalid").removeClass("is-valid");
        $("#phone + .alert").removeClass("d-none");
        isPhoneValid = false;
    }
    changeBtn();
}
function validateAge() {
    var regex = /^([1-9][0-9]||[1-9])$/gm;
    if (regex.test(ageInput.val())) {
        ageInput.addClass("is-valid").removeClass("is-invalid");
        $("#age + .alert").addClass("d-none");
        isAgeValid = true;
    } else {
        ageInput.addClass("is-invalid").removeClass("is-valid");
        $("#age + .alert").removeClass("d-none");
        isAgeValid = false;
    }
    changeBtn();
}
function validatePassword() {
    var regex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/gm;
    if (regex.test(passwordInput.val())) {
        passwordInput.addClass("is-valid").removeClass("is-invalid");
        $("#pass + .alert").addClass("d-none");
        isPasswordValid = true;
    } else {
        passwordInput.addClass("is-invalid").removeClass("is-valid");
        $("#pass + .alert").removeClass("d-none");
        isPasswordValid = false;
    }
    changeBtn();
}
function validateRePassword() {
    if (rePasswordInput.val() == passwordInput.val()) {
        rePasswordInput.addClass("is-valid").removeClass("is-invalid");
        $("#repass + .alert").addClass("d-none");
        isRePasswordValid = true;
    } else {
        rePasswordInput.addClass("is-invalid").removeClass("is-valid");
        $("#repass + .alert").removeClass("d-none");
        isRePasswordValid = false;
    }
    changeBtn();
}
function changeBtn() {
    let submitButton = $("#submitButton");
    if (
        isNameValid &&
        isEmailValid &&
        isPhoneValid &&
        isAgeValid &&
        isPasswordValid &&
        isRePasswordValid
    ) {
        submitButton.removeAttr("disabled");
        console.log("All fields are valid!");
    } else {
        submitButton.attr("disabled", "disabled");
        console.log("Some fields are invalid.");
    }
}


