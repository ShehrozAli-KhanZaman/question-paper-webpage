document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbzTnmDwDi8Gl60qzrJmB6hRJ1rSnifiu87wM3vX-rGjA2PwgA0drepbni0u3mv5KL0I/exec"
  );
  const data = await response.json();

  const content = document.getElementById("content");

  // Create columns
  const container = document.createElement("div");
  container.className = "container";

  const questionColumn = document.createElement("div");
  questionColumn.className = "question-column";
  container.appendChild(questionColumn);

  const numberColumn = document.createElement("div");
  numberColumn.className = "number-column";
  container.appendChild(numberColumn);

  content.appendChild(container);

  // Arrays to keep track of question elements and heights
  const questionElements = [];
  const numberElements = [];

  data.forEach((item, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";

    const urduQuestion = document.createElement("div");
    urduQuestion.className = "text urdu";
    urduQuestion.innerHTML = item.UQuest;

    const englishQuestion = document.createElement("div");
    englishQuestion.className = "text english";
    englishQuestion.innerHTML = item.Quest;

    questionDiv.appendChild(urduQuestion);
    questionDiv.appendChild(englishQuestion);

    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options";
    const displayedOptions = new Set();
    ["Op4", "Op3", "Op2", "Op1"].forEach((option, idx) => {
      const engOption = item[option];
      const urduOption = item[`U${option}`];

      // If either English or Urdu option is not present, skip
      if (!engOption && !urduOption) return;

      const removeDollarSigns = (text) => {
        return text.replace(/^\$(.+)\$$/, "$1");
      };
      const engOptionCleaned = engOption ? removeDollarSigns(engOption) : "";
      const urduOptionCleaned = urduOption ? removeDollarSigns(urduOption) : "";
      const displayText =
        engOptionCleaned === urduOptionCleaned
          ? engOptionCleaned
          : `${engOptionCleaned} / ${urduOptionCleaned}`;

      // Check if this option has been displayed before
      if (!displayedOptions.has(engOption)) {
        const optionP = document.createElement("p");
        optionP.innerHTML = `${displayText} (${String.fromCharCode(
          65 + (3 - idx)
        )})`;
        optionsDiv.appendChild(optionP);
        displayedOptions.add(engOptionCleaned); // Mark this option as displayed
      }
    });

    questionDiv.appendChild(optionsDiv);
    questionColumn.appendChild(questionDiv);

    // Create and add number element
    const numberDiv = document.createElement("div");
    numberDiv.className = "number";
    numberDiv.innerText = `${index + 1}`;
    numberColumn.appendChild(numberDiv);

    // Add questionDiv and numberDiv to the arrays
    questionElements.push(questionDiv);
    numberElements.push(numberDiv);
  });

  // Function to adjust the heights dynamically
  const adjustHeights = () => {
    questionElements.forEach((questionDiv, index) => {
      const numberDiv = numberElements[index];
      if (numberDiv) {
        const questionHeight = questionDiv.offsetHeight;
        numberDiv.style.height = `${questionHeight}px`;
      }
    });
  };

  // Adjust heights after content is rendered
  adjustHeights();

  // Re-render MathJax for mathematical symbols
  MathJax.typesetPromise();
});
