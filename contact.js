document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    const fields = ["firstName", "lastName", "email", "password"];
    fields.forEach((field) => {
        document.getElementById(field).classList.remove("error-border");
        document.getElementById(field + "Error").textContent = "";
    });

    if (firstName === "") {
        document.getElementById("firstName").classList.add("error-border");
        document.getElementById("firstNameError").textContent = "First name is required.";
        isValid = false;
    }

    if (lastName === "") {
        document.getElementById("lastName").classList.add("error-border");
        document.getElementById("lastNameError").textContent = "Last name is required.";
        isValid = false;
    }

    if (email === "") {
        document.getElementById("email").classList.add("error-border");
        document.getElementById("emailError").textContent = "Email is required.";
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        document.getElementById("email").classList.add("error-border");
        document.getElementById("emailError").textContent = "Please enter a valid email address.";
        isValid = false;
    }

    if (password === "") {
        document.getElementById("password").classList.add("error-border");
        document.getElementById("passwordError").textContent = "Password is required.";
        isValid = false;
    } else if (password.length < 6) {
        document.getElementById("password").classList.add("error-border");
        document.getElementById("passwordError").textContent = "Password must be at least 6 characters.";
        isValid = false;
    }

    if (isValid) {
        alert("Form submitted successfully!");
        window.location.href = "index.html"; 
    }
});
