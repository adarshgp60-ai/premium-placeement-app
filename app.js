const copyButton = document.getElementById("copyPrompt");
const promptBox = document.getElementById("promptBox");
const copyFeedback = document.getElementById("copyFeedback");

if (copyButton && promptBox && copyFeedback) {
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(promptBox.value);
      copyFeedback.textContent = "Prompt copied.";
    } catch {
      copyFeedback.textContent = "Clipboard access failed. Copy manually from the prompt box.";
    }
  });
}
