(() => {
  const form = document.querySelector("[data-ingredient-form]");

  if (!form) {
    return;
  }

  const submitButton = form.querySelector("[data-form-submit]");
  const status = form.querySelector("[data-form-status]");
  const defaultLabel = submitButton.textContent.trim();

  const setStatus = (message, state) => {
    status.textContent = message;

    if (state) {
      status.dataset.state = state;
    } else {
      delete status.dataset.state;
    }
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const payload = Object.fromEntries(new FormData(form).entries());

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    form.setAttribute("aria-busy", "true");
    setStatus("Sending your request...");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false || result.success === "false") {
        throw new Error("Form submission failed");
      }

      form.reset();
      setStatus("Request sent. Our sourcing team will review it and reply shortly.", "success");
    } catch (error) {
      setStatus(
        "We could not send the request. Please try again, or contact fbridge@webridge.es if the problem continues.",
        "error",
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = defaultLabel;
      form.removeAttribute("aria-busy");
    }
  });
})();
