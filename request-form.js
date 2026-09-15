(() => {
  const form = document.querySelector("[data-ingredient-form]");

  if (!form) {
    return;
  }

  const submitButton = form.querySelector("[data-form-submit]");
  const status = form.querySelector("[data-form-status]");
  const defaultLabel = submitButton.textContent.trim();

  const createSubmissionId = () => {
    if (globalThis.crypto?.randomUUID) {
      return globalThis.crypto.randomUUID();
    }

    const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
  };

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
    const submissionId = form.dataset.submissionId || createSubmissionId();
    form.dataset.submissionId = submissionId;
    payload.submissionId = submissionId;

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

      if (!response.ok || result.ok !== true) {
        throw new Error("Form submission failed");
      }

      form.reset();
      delete form.dataset.submissionId;
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
