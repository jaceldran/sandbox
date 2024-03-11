const API_LOGIN_ENDPOINT = "https://backend.local/api/login";
const AUTH_OK_URL = "./auth-ok.html";
let $box, $form, $icon;

document.addEventListener("DOMContentLoaded", (event) => {
    $form = document.querySelector("form");
    $icon = document.querySelector("button .animate-spin");
    $box = document.querySelector(".box");

    $form.addEventListener("submit", (evt) => {
        evt.preventDefault();
        onSubmitForm();
    });
});

const onSubmitForm = () => {
    $icon.classList.remove("hidden");

    const method = "POST";
    const body = JSON.stringify({
        email: document.querySelector("input[name=email]").value,
        password: document.querySelector("input[name=password]").value
    });
    const headers = {
        "Origin": "http://127.0.0.1:3000",
        "Access-Control-Request-Method": method,
        "Access-Control-Request-Headers": "X-Custom-Header, Content-Type",
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    fetch(API_LOGIN_ENDPOINT, { method, body, headers })
        .then((response) => response.json())
        .then((authResponse) => {
            onAuthResponse(authResponse);
        })
        .catch((err) => {
            $icon.classList.add("hidden");
            setTimeout(() => { alert(`⚠️ ${err}`); }, 100)
        })
        .finally(() => {
            $icon.classList.add("hidden");
        });
}

const onAuthResponse = (authResponse) => {
    if (authResponse.ok === true) {
        onAuthOk(authResponse);
        slideDoor();
        setTimeout(() => { openDoor(); }, 600)
        setTimeout(() => { location.href = AUTH_OK_URL; }, 1500)
    }

    if (authResponse.ok === false && authResponse.error) {
        alert(authResponse.error);
    }

    if (authResponse?.errors?.email) {
        document.querySelector(".error-email").innerHTML = authResponse.errors.email;
    }

    if (authResponse?.errors?.password) {
        document.querySelector(".error-password").innerHTML = authResponse.errors.password;
    }
}

const onAuthOk = (authResponse) => {
    localStorage.setItem("auth", JSON.stringify(authResponse));
}

const openDoor = () => {
    document.querySelector(".frame > .door").classList.add("open");
}

const slideDoor = () => {
    $box.classList.add("slide");
    const bordersClass = window.innerWidth > 600
        ? "wide-borders"
        : "narrow-borders";
    setTimeout(() => { $box.classList.add(bordersClass); }, 500);
}
