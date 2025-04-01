// import Chart from "chart.js/auto";
let input = document.querySelector("input");
let container = document.querySelector(".sorting");
let nums, divs, t, bt;
let swapNoSel = 0;
let sortNoSel = 0;
let swapNoIns = 0;
let sortNoIns = 0;

document.addEventListener("DOMContentLoaded", function () {
  // Add placeholder array on first load
  if (container.children.length === 0) {
    const defaultArray = [5, 3, 8, 1, 9, 4];
    input.value = defaultArray.join(", ");
    createVisualization(defaultArray);
  }
  updateChart();
});

// Checking if the local storage
let isStorageFull = async () => {
  try {
    let testing = localStorage.setItem("rahul", "robot");
    let Vishu = localStorage.getItem("rahul");
  } catch (e) {
    localStorage.clearMem();
    updateChart();
  }
};

// Determine the speed of the transition
let transitionSpeed = 1800 - document.querySelector("#slider").value;
document.querySelector("#slider").oninput = function () {
  transitionSpeed = 1800 - this.value;
};

// DropDown menu
let checkbox = document.querySelector(".dropdown");
checkbox.addEventListener("change", () => {
  item = document.querySelector(".dropdownn-items");
  if (checkbox.checked) {
    item.style.height = "130px";
  } else {
    item.style.height = "0px";
  }
});

// Changing the name of the dropdown when selected a type of sort
document.querySelectorAll(".selectSort").forEach((item) => {
  item.addEventListener("change", () => {
    if (item.checked) {
      checkbox.nextElementSibling.innerText = item.nextElementSibling.innerText;
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event("change"));
    }
  });
});

// Clear local storage
let clearMem = () => {
  localStorage.removeItem("swapValueSel");
  localStorage.removeItem("sortValueSel");
  localStorage.removeItem("swapValueIns");
  localStorage.removeItem("sortValueIns");
  updateChart();
  sortNoSel = 0;
  sortNoIns = 0;

  // Show cleared after clearing the storage
  const btn = document.querySelector(".danger");
  const originalText = btn.innerText;
  btn.innerText = "CLEARED!";
  setTimeout(() => {
    btn.innerText = originalText;
  }, 1000);
};

// Function to create visualization of divs forming from the input values
function createVisualization(arrayValues) {
  container.innerHTML = "";

  let i = 0,
    j = 0.5,
    n = 0;
  arrayValues.forEach((num) => {
    if (!isNaN(num) && num !== "") {
      let div = document.createElement("div");
      div.innerHTML = num;
      div.classList.add("elements");
      div.setAttribute("data-value", n);
      div.style.left = `${i * 60}px`;
      div.style.top = `${j * 60}px`;

      // Add subtle animation on creation
      div.style.opacity = "0";
      div.style.transform = "scale(0.8)";
      container.appendChild(div);

      setTimeout(() => {
        div.style.opacity = "1";
        div.style.transform = "scale(1)";
      }, n * 100);

      if (
        container.getBoundingClientRect().width <
        div.getBoundingClientRect().width + (i + 1) * 60
      ) {
        j++;
        i = -1;
      }
      i++;
      n++;
    }
  });
}

// Taking input from user and giving to createVisualization funvtion to
input.addEventListener("keyup", function (event) {
  createVisualization(input.value.split(",").map((num) => num.trim()));
});

// Moving the divs Verticallyv Up
let swapVertical = (a, b) => {
  return new Promise((res) => {
    t = parseInt(a.style.top);
    bt = parseInt(b.style.top);
    a.style.top = t - 20 + "px";
    b.style.top = bt + 20 + "px";
    setTimeout(res, transitionSpeed);
  });
};

// Moving the divs Horizantally
let swapHorizontal = async (a, b) => {
  await swapVertical(a, b);
  return new Promise((resolve) => {
    [a.style.left, b.style.left] = [b.style.left, a.style.left];
    setTimeout(resolve, transitionSpeed);
  });
};

// moving the divs Vertically Down
let swapDown = async (a, b) => {
  await swapHorizontal(a, b);
  return new Promise((res) => {
    [a.style.top, b.style.top] = [bt + "px", t + "px"];
    setTimeout(() => {
      res();
    }, transitionSpeed);
  });
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// choose which type of Sort is to be visualized
let Sort = async () => {
  let dropdown = document.querySelector(".choose");
  if (dropdown.innerText === "Selection Sort") {
    SelectionSort();
  } else if (dropdown.innerText === "Insertion Sort") {
    InsertionSort();
  } else {
    window.alert("Choose any one type of sort!!");
  }
};

// Selection Sort
let SelectionSort = async () => {
  // Disable buttons during sorting
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((btn) => (btn.disabled = true));
  isStorageFull();
  sortNoSel++;
  swapNoSel = 0;
  let div1, div2, div3;
  let tempSort = JSON.parse(localStorage.getItem("sortValueSel")) || []; // Ensure it's an array
  tempSort.push(sortNoSel); // Add new sort number
  localStorage.setItem("sortValueSel", JSON.stringify(tempSort)); // Store it as a JSON array

  divs = document.querySelectorAll(".elements");
  let n = divs.length;

  // Reset all elements to default color
  divs.forEach((div) => {
    div.style.backgroundColor = "var(--element-default)";
  });

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    await delay(transitionSpeed / 1.2);
    document.querySelector(`div[data-value="${i}"]`).style.backgroundColor =
      "var(--element-currentAtI)";
    for (let j = i + 1; j < n; j++) {
      div2 = document.querySelector(`div[data-value="${j}"]`);
      div3 = document.querySelector(`div[data-value="${minIndex}"]`);
      div2.style.backgroundColor = "var(--element-currentAtJ)";

      if (parseInt(div2.innerText) < parseInt(div3.innerText)) {
        div2.style.backgroundColor = "var(--element-default)";
        div3.style.backgroundColor = "var(--element-default)";
        minIndex = j;
        div3 = document.querySelector(`div[data-value="${minIndex}"]`);
        div3.style.backgroundColor = "var(--element-comparing)";
      } else {
        await delay(transitionSpeed / 1.2);
        div2.style.backgroundColor = "var(--element-default)";
      }
    }
    div1 = document.querySelector(`div[data-value="${i}"]`);
    if (minIndex !== i) {
      await swapDown(div1, div3);
      [div1.dataset.value, div3.dataset.value] = [
        div3.dataset.value,
        div1.dataset.value,
      ];
      swapNoSel++;
    }
    document.querySelector(
      `div[data-value="${minIndex}"]`
    ).style.backgroundColor = "var(--element-default";
    document.querySelector(`div[data-value="${i}"]`).style.backgroundColor =
      "var(--element-sorted)";
  }
  await delay(transitionSpeed / 1.2);
  document.querySelector(`div[data-value="${n - 1}"]`).style.backgroundColor =
    "var(--element-sorted)";

  // Store updated values in localStorage
  let tempSwap = JSON.parse(localStorage.getItem("swapValueSel")) || [];
  let prevSwap = [...tempSwap, swapNoSel];
  localStorage.setItem("swapValueSel", JSON.stringify(prevSwap));

  // Update the chart
  updateChart();

  // Re-enable buttons
  buttons.forEach((btn) => (btn.disabled = false));
};

// Inasertion Sort
let InsertionSort = async () => {
  // console.log("Insertion Sort Started");

  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((btn) => (btn.disabled = true));
  isStorageFull();
  sortNoIns++;
  swapNoIns = 0;
  let tempSort = JSON.parse(localStorage.getItem("sortValueIns")) || []; // Ensure it's an array
  tempSort.push(sortNoIns); // Add new sort number
  localStorage.setItem("sortValueIns", JSON.stringify(tempSort)); // Store it as a JSON array

  let divs = document.querySelectorAll(".elements");
  let n = divs.length;

  // Reset all elements to default color
  divs.forEach((div) => {
    div.style.backgroundColor = "var(--element-default)";
  });

  for (let i = 1; i < n; i++) {
    let div1 = document.querySelector(`div[data-value="${i}"]`);
    let j = i - 1;

    // Highlight the current div at i index
    div1.style.backgroundColor = "var(--element-currentAtI)";
    await delay(transitionSpeed / 1.2 ); // Add a small delay for visual effect

    while (j >= 0) {
      let div2 = document.querySelector(`div[data-value="${j}"]`);

      // Highlight the divs that are being compared
      div2.style.backgroundColor = "var(--element-currentAtJ)";
      await delay(transitionSpeed / 1.2); // Add a small delay for visual effect

      if (parseInt(div2.innerText) > parseInt(div1.innerText)) {
        // Swap down the elements
        await swapDown(div1, div2);
        swapNoIns++;
        // Swap data-value attributes
        [div1.dataset.value, div2.dataset.value] = [
          div2.dataset.value,
          div1.dataset.value,
        ];

        // Reset the colors after swap
        div1.style.backgroundColor = "var(--element-default)";
        div2.style.backgroundColor = "var(--element-default)";
      } else {
        // Break the loop if no swap is needed
        break;
      }
      j--;
    }

    // Once the current element is placed in its correct position
    div1.style.backgroundColor = "var(--element-sorted)";
    await delay(transitionSpeed / 1.2); // Small delay to visualize the sorted element

    // Reset the color of any other elements if necessary
  }

  // Make sure all elements are sorted at the end
  divs.forEach((div) => {
    if (div.style.backgroundColor !== "var(--element-sorted)") {
      div.style.backgroundColor = "var(--element-sorted)";
    }
  });
  let tempSwap = JSON.parse(localStorage.getItem("swapValueIns")) || [];
  let prevSwap = [...tempSwap, swapNoIns];
  localStorage.setItem("swapValueins", JSON.stringify(prevSwap));

  updateChart();
  // Re-enable buttons after sorting
  buttons.forEach((btn) => (btn.disabled = false));
};

let shuffle = async () => {
  divs = document.querySelectorAll(".elements");

  // Disable buttons during shuffling
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((btn) => (btn.disabled = true));

  // Reset all elements to default color
  divs.forEach((div) => {
    div.style.backgroundColor = "var(--element-default)";
  });

  let n = Math.floor(Math.random() * 7) + 1;

  for (let i = 0; i < n; i++) {
    let firstIndex = Math.floor(Math.random() * divs.length);
    let secondIndex = Math.floor(Math.random() * divs.length);
    while (firstIndex === secondIndex) {
      secondIndex = Math.floor(Math.random() * divs.length);
    }
    let first = document.querySelector(`div[data-value="${firstIndex}"]`);
    let second = document.querySelector(`div[data-value="${secondIndex}"]`);

    // Highlight elements being shuffled
    first.style.backgroundColor = "var(--element-comparing)";
    second.style.backgroundColor = "var(--element-comparing)";
    await delay(300);

    [first.style.top, first.style.left, second.style.top, second.style.left] = [
      second.style.top,
      second.style.left,
      first.style.top,
      first.style.left,
    ];
    [first.dataset.value, second.dataset.value] = [
      second.dataset.value,
      first.dataset.value,
    ];

    await delay(300);
    first.style.backgroundColor = "var(--element-default)";
    second.style.backgroundColor = "var(--element-default)";
  }

  // Re-enable buttons
  buttons.forEach((btn) => (btn.disabled = false));
};

let chart; // Store chart instance

function updateChart() {
  const ctx = document.getElementById("myChart").getContext("2d");

  let x;
  let y;
  // Retrieve and parse stored values as arrays
  let dropdown = document.querySelector(".choose");
  if (dropdown.innerText === "Selection Sort") {
    x = JSON.parse(localStorage.getItem("sortValueSel")) || [];
    y = JSON.parse(localStorage.getItem("swapValueSel")) || [];
  } else if (dropdown.innerText === "Insertion Sort") {
    x = JSON.parse(localStorage.getItem("sortValueIns")) || [];
    y = JSON.parse(localStorage.getItem("swapValueIns")) || [];
  } else {
    x = JSON.parse(localStorage.getItem("sortValueSel")) || [];
    y = JSON.parse(localStorage.getItem("swapValueSel")) || [];
  }

  if (chart) {
    chart.destroy(); // Destroy previous chart instance before re-rendering
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: x, // X-axis: Sort numbers
      datasets: [
        {
          label: "Swaps Per Sort",
          data: y, // Y-axis: Swap values
          backgroundColor: "rgba(76, 201, 240, 0.2)",
          borderColor: "rgba(76, 201, 240, 1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "rgba(76, 201, 240, 1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#f8f9fa",
            font: {
              family: "'Poppins', sans-serif",
              size: 14,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(30, 30, 30, 0.8)",
          titleFont: {
            family: "'Poppins', sans-serif",
            size: 14,
          },
          bodyFont: {
            family: "'Poppins', sans-serif",
            size: 13,
          },
          padding: 12,
          cornerRadius: 8,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Sort No.",
            color: "#f8f9fa",
            font: {
              family: "'Poppins', sans-serif",
              size: 14,
            },
          },
          ticks: {
            color: "#f8f9fa",
            font: {
              family: "'Poppins', sans-serif",
            },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
          },
        },
        y: {
          title: {
            display: true,
            text: "Swaps",
            color: "#f8f9fa",
            font: {
              family: "'Poppins', sans-serif",
              size: 14,
            },
          },
          suggestedMin: 0,
          ticks: {
            color: "#f8f9fa",
            font: {
              family: "'Poppins', sans-serif",
            },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
          },
        },
      },
    },
  });
}
