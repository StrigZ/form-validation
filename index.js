const form = document.querySelector("form");

const validationOptions = [
  {
    attribute: "required",
    validate: (input, label) => input.value.trim().length > 0,
    errorMessage: (input, label) => `${label.textContent} is required!`,
  },
  {
    attribute: "minLength",
    validate: (input, label) =>
      input.value.trim().length > input.getAttribute("minLength"),
    errorMessage: (input, label) =>
      `${label.textContent} must be at least ${input.getAttribute(
        "minLength"
      )} characters long!`,
  },
  {
    attribute: "pattern",
    validate: (input, label) => {
      const patternRegex = new RegExp(input.getAttribute("pattern"));

      return patternRegex.test(input.value.trim());
    },
    errorMessage: (input, label) => {
      switch (input.id) {
        case "password":
          return "Password must contain at least one lowercase letter, one uppercase letter, and one number.";

        default:
          return `Please provide valid ${label.textContent.toLowerCase()}!`;
      }
    },
  },
  {
    attribute: "match",
    validate: (input, label) => {
      const matchElement = document.querySelector(
        `#${input.getAttribute("match")}`
      );

      const isValid = matchElement.value === input.value;
      if (!isValid) {
        input.setCustomValidity(
          `${label.textContent} and ${input.getAttribute(
            "match"
          )} doesn't match`
        );
      } else {
        input.setCustomValidity("");
      }
      return isValid;
    },
    errorMessage: (input, label) => {
      switch (input.id) {
        case "password-confirm":
          return `Passwords do not match.`;

        default:
          return "Fields do not match.";
      }
    },
  },
];

let isFormValid = true;
function validateForm() {
  form.addEventListener("input", ({ target }) =>
    validateFormControl(target.parentElement)
  );

  Array.from(form.querySelectorAll("input")).forEach((formInput) => {
    formInput.addEventListener("blur", ({ target }) => {
      validateFormControl(target.parentElement);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    validateAllFormControls();

    if (isFormValid) {
      alert("Submitted");
      form.reset();
    }
  });
}

function validateAllFormControls() {
  Array.from(form.querySelectorAll(".form-control")).forEach((formControl) =>
    validateFormControl(formControl)
  );
}

function validateFormControl(formControl) {
  const input = formControl.querySelector("input");
  const label = formControl.querySelector("label");
  const errorContainer = formControl.querySelector("p.error");

  let isFormControlValid = true;
  validationOptions.forEach(
    ({ attribute, validate, errorMessage: getErrorMessage }) => {
      if (
        input.hasAttribute(attribute) &&
        !validate(input, label) &&
        isFormControlValid
      ) {
        isFormValid = false;
        isFormControlValid = false;
        errorContainer.textContent = getErrorMessage(input, label);
      }
    }
  );

  if (isFormControlValid) {
    isFormValid = true;
    errorContainer.textContent = "";
  }
}
validateForm();
