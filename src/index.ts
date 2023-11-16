import "./style.css";

let root: HTMLElement | null = document.getElementById("app");

if (!root) {
    const body: HTMLElement | null = document.querySelector("body");
    root = document.createElement("div");
    root.classList.add("app");
    body?.append(root);
}

const maxWidth: number = 50;
const maxHeight: number = 20;
let nums: number[] = [];
let numDivs: HTMLDivElement[] = [];
let n: number = 0;
let scale: number = 100;
let stopSort: boolean = false;
let speed: number = 0;

let label: HTMLSpanElement = document.createElement("span");
label.innerHTML = `Lines: ${n}`;

function handleDivGeneration() {
    if (n > 0 && root) {
        let containerDiv: HTMLDivElement | null = root.querySelector(".container");
        if (containerDiv) {
            root.removeChild(containerDiv);
        }

        containerDiv = document.createElement("div");
        containerDiv.classList.add("container");
        containerDiv.style.display = "flex";
        containerDiv.style.gap = "0.25rem";

        numDivs = [];
        nums.map((num) => {
            let divElem: HTMLDivElement = document.createElement("div");
            divElem.style.width = `${maxWidth / n}rem`;
            divElem.style.height = `${num * (maxHeight / n)}rem`;
            divElem.style.backgroundColor = "lightblue";
            if (maxWidth / n >= Math.log10(n) + 1) divElem.innerText = `${num}`;
            divElem.style.display = "flex";
            divElem.style.alignItems = "end";
            divElem.style.justifyContent = "center";
            numDivs.push(divElem);
            containerDiv?.append(divElem);
        });
        root?.append(containerDiv);
    }
}

function handleGenerate(event: MouseEvent) {
    event.stopPropagation();
    stopSort = true;
    n = Math.ceil(Math.random() * scale);

    label.innerHTML = `Lines: ${n}`;
    nums = [];
    for (let i: number = 0; i < n; ++i) {
        nums.push(Math.ceil(Math.random() * n));
    }
    handleDivGeneration();
}

function updateNumDivs() {
    if (n > 0 && root) {
        let containerDiv: HTMLDivElement | null = root.querySelector(".container");
        if (containerDiv) {
            root.removeChild(containerDiv);
        }

        containerDiv = document.createElement("div");
        containerDiv.classList.add("container");
        containerDiv.style.display = "flex";
        containerDiv.style.gap = "0.25rem";

        numDivs.map((numDiv) => {
            containerDiv?.append(numDiv);
        });
        root?.append(containerDiv);
    }

}

function removeActive() {
    const elem: HTMLElement | null = document.querySelector(".active");
    elem?.classList.remove("active");
    stopSort = true;
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function handleStop(event: MouseEvent) {
    event.stopPropagation();
    stopSort = true;
}

function startSorting(elem: HTMLElement | null) {
    removeActive();
    elem?.classList.add("active");
    stopSort = false; 
}

function endSorting() {
    removeActive();
    stopSort = true;
}

async function swap(i: number, j: number) {
    numDivs[i].style.backgroundColor = "palevioletred";
    numDivs[j].style.backgroundColor = "palevioletred";
    updateNumDivs();
    await sleep(speed);
    let t: number = nums[i];
    nums[i] = nums[j];
    nums[j] = t;    

    let td: string = numDivs[i].style.height;
    numDivs[i].style.height = numDivs[j].style.height;
    numDivs[j].style.height = td;
    numDivs[i].style.backgroundColor = "lightgreen";
    numDivs[j].style.backgroundColor = "lightgreen";

    if (maxWidth / n >= Math.log10(n) + 1) {
        numDivs[i].innerText = `${nums[i]}`;
        numDivs[j].innerText = `${nums[j]}`;
    }

    updateNumDivs();
    await sleep(speed);

    numDivs[i].style.backgroundColor = "lightblue";
    numDivs[j].style.backgroundColor = "lightblue";
    updateNumDivs();
    await sleep(speed);
}

async function handleBubbleSort(event: MouseEvent) {
    event.stopPropagation();
    startSorting(event.target as HTMLElement);

    for (let i: number = 0; i < n && !stopSort; ++i) {
        for (let j: number = n-1; j > i && !stopSort; --j) {
            if (nums[j] < nums[j-1]) {
                await swap(j, j-1);
            }
        }
        numDivs[i].style.backgroundColor = "lightseagreen";
    }

    endSorting();
}

async function handleInsertionSort(event: MouseEvent) {
    event.stopPropagation();
    startSorting(event.target as HTMLElement);
    
    for (let i: number = 1; i < n && !stopSort; ++i) {
        let j = i - 1;
        let key = nums[i];
        while (!stopSort && j >= 0 && nums[j] > key) {
            await swap(j, j+1);
            --j;
        }
    }

    for (let i: number = 0; i < n && !stopSort; ++i) {
        numDivs[i].style.backgroundColor = "lightseagreen"; 
    }

    endSorting();
}

async function handleQuickSort(event: MouseEvent) {
    event.stopPropagation();
    removeActive();
}

async function handleMergeSort(event: MouseEvent) {
    event.stopPropagation();
    removeActive();
}

let generateButton: HTMLButtonElement = document.createElement("button");
generateButton.innerText = "Generate";
generateButton.addEventListener("click", handleGenerate);

let sortingAlgo: { name: string, func: (e: MouseEvent) => void }[] = [
    { name: "Bubble Sort", func: handleBubbleSort },
    { name: "Insertion Sort", func: handleInsertionSort },
    { name: "Quick Sort", func: handleQuickSort },
    { name: "Merge Sort", func: handleMergeSort },
];


let stopButton: HTMLButtonElement = document.createElement("button");
stopButton.innerText = "Stop";
stopButton.addEventListener("click", handleStop);

let topDiv: HTMLDivElement = document.createElement("div");
topDiv.classList.add("topDiv");
topDiv.style.display = "flex";
topDiv.style.gap = "1rem";
topDiv.style.alignItems = "center";

root.style.display = "flex";
root.style.flexDirection = "column";
root.style.gap = "2rem";
root.style.alignItems = "center";
root.style.justifyContent = "center";
root.style.margin = "5rem";

topDiv.append(label);
topDiv.append(generateButton);

sortingAlgo.map((sort: { name: string, func: (e: MouseEvent) => void }) => {
    let sortButton: HTMLButtonElement = document.createElement("button");
    sortButton.innerText = sort.name;
    sortButton.addEventListener("click", sort.func);
    topDiv.append(sortButton);
});

function handleScaleSliderChange(event: Event) {
    event.stopPropagation();
    const target: HTMLInputElement = event.target as HTMLInputElement;
    scale = Number(target.value);
    scaleLabel.innerHTML = `max lines: ${scale}`;
}

function handleSpeedSliderChange(event: Event) {
    event.stopPropagation();
    const target: HTMLInputElement = event.target as HTMLInputElement;
    speed = Number(target.value);
    speedLabel.innerHTML = `speed: ${speed}`;
}

let scaleLabel: HTMLSpanElement = document.createElement("span");
scaleLabel.innerHTML = `max lines: ${scale}`;

let scaleSlider: HTMLInputElement = document.createElement("input");
scaleSlider.type = "range";
scaleSlider.max = "100";
scaleSlider.min = "10";
scaleSlider.value = `${scale}`;
scaleSlider.oninput = handleScaleSliderChange;

let speedLabel: HTMLSpanElement = document.createElement("span");
speedLabel.innerHTML = `speed: ${speed}`;

let speedSlider: HTMLInputElement = document.createElement("input");
speedSlider.type = "range";
speedSlider.max = "100";
speedSlider.min = "10";
speedSlider.value = `${speed}`;
speedSlider.oninput = handleSpeedSliderChange;

let midDiv: HTMLDivElement = document.createElement("div");
midDiv.classList.add("midDiv");
midDiv.style.display = "flex";
midDiv.style.gap = "1rem";
midDiv.style.alignItems = "center";

midDiv.append(scaleLabel);
midDiv.append(scaleSlider);
midDiv.append(speedLabel);
midDiv.append(speedSlider);
root.append(midDiv);

topDiv.append(stopButton);
root.append(topDiv);

