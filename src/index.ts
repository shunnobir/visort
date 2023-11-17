import "./style.css";

let root: HTMLElement | null = document.getElementById("app");

if (!root) {
    root = document.createElement("div");
    root.classList.add("app");
    document.body.append(root);
}

const maxWidth: number = 40;
const maxHeight: number = 40;
let nums: number[] = [];
let numDivs: HTMLDivElement[] = [];
let n: number = 0;
let scale: number = 200;
let stopSort: boolean = false;
let speed: number = 0;
const speedScale: number = 300;

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
            divElem.classList.add("num-divs");
            divElem.style.width = `${maxWidth / n}rem`;
            divElem.style.height = `${num * (maxHeight / n)}rem`;
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
    endSorting();
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
    endSorting();
}

function canStartSorting(elem: HTMLElement | null) {
    if (!elem) return false;
    const activeElem: HTMLElement | null = document.querySelector(".active");
    if (activeElem && activeElem != elem) {
        stopSort = true;
        return false;
    }
    return true;
}

function startSorting(elem: HTMLElement | null) {
    endSorting();
    elem?.classList.add("active");
    stopSort = false; 
}

function endSorting() {
    removeActive();
    stopSort = true;
}

async function swap(i: number, j: number) {
    numDivs[i].classList.add("compare-divs");
    numDivs[j].classList.add("compare-divs");
    updateNumDivs();
    await sleep(speed);

    numDivs[i].classList.remove("compare-divs");
    numDivs[j].classList.remove("compare-divs");

    let t: number = nums[i];
    nums[i] = nums[j];
    nums[j] = t;    

    let td: HTMLDivElement = numDivs[i];
    numDivs[i] = numDivs[j];
    numDivs[j] = td;
    numDivs[i].classList.add("swapped-divs");
    numDivs[j].classList.add("swapped-divs");

    if (maxWidth / n >= Math.log10(n) + 1) {
        numDivs[i].innerText = `${nums[i]}`;
        numDivs[j].innerText = `${nums[j]}`;
    }

    updateNumDivs();
    await sleep(speed);

    numDivs[i].classList.remove("swapped-divs");
    numDivs[j].classList.remove("swapped-divs");

    updateNumDivs();
    await sleep(speed);
}

async function place(i: number, j: number, k: number, t: number) {
    numDivs[j].classList.add("compare-divs");
    numDivs[k].classList.add("compare-divs");
    updateNumDivs();
    await sleep(speed);

    numDivs[j].classList.remove("compare-divs");
    numDivs[k].classList.remove("compare-divs");

    nums[i] = t;

    for (let l: number = j; l > i; --l) {
        let td: HTMLDivElement = numDivs[l-1];
        numDivs[l-1] = numDivs[l];
        numDivs[l] = td;
    }

    numDivs[j].classList.add("swapped-divs");
    numDivs[k].classList.add("swapped-divs");

    if (maxWidth / n >= Math.log10(n) + 1) {
        numDivs[i].innerText = `${nums[i]}`;
    }

    updateNumDivs();
    await sleep(speed);

    numDivs[j].classList.remove("swapped-divs");
    numDivs[k].classList.remove("swapped-divs");

    updateNumDivs();
    await sleep(speed);
}

async function handleBubbleSort(event: MouseEvent) {
    event.stopPropagation();
    if (!canStartSorting(event.target as HTMLElement)) return;
    startSorting(event.target as HTMLElement);

    for (let i: number = 0; i < n && !stopSort; ++i) {
        for (let j: number = n-1; j > i && !stopSort; --j) {
            if (nums[j] < nums[j-1]) {
                await swap(j, j-1);
            }
        }
    }

    for (let i: number = 0; i < n && !stopSort; ++i) {
        numDivs[i].classList.add("sorted-divs");
    }

    endSorting();
}

async function handleInsertionSort(event: MouseEvent) {
    event.stopPropagation();
    if (!canStartSorting(event.target as HTMLElement)) return;
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
        numDivs[i].classList.add("sorted-divs");
    }

    endSorting();
}

async function handleQuickSort(event: MouseEvent) {
    event.stopPropagation();
    if (!canStartSorting(event.target as HTMLElement)) return;
    startSorting(event.target as HTMLElement);
    endSorting();
}

async function handleMergeSort(event: MouseEvent) {
    event.stopPropagation();
    if (!canStartSorting(event.target as HTMLElement)) return;
    startSorting(event.target as HTMLElement);

    async function handleMerge(l: number, mid: number, r: number) {
        let t1: number[] = nums.slice(l, mid+1);
        let t2: number[] = nums.slice(mid+1, r+1);

        t1.push(scale + 10);
        t2.push(scale + 10);

        let j = 0, k = 0;
        for (let i: number = l; i <= r && !stopSort; ++i) {
            if (t1[j] <= t2[k]) {
                await place(i, j+l, k+mid+1-(k+mid+1 > r ? 1 : 0), t1[j]);
                ++j;
            } else {
                await place(i, k+mid+1, j+l-(j+l > mid ? 1 : 0), t2[k]);
                ++k;
            }
        }
    }

    async function handleMergeSortInternal(l: number, r: number) {
        if (l < r && !stopSort) {
            let mid = Math.floor((l + r) / 2);
            console.log(l, r, mid);
            await handleMergeSortInternal(l, mid);
            await handleMergeSortInternal(mid+1, r);
            await handleMerge(l, mid, r);
        }
    }

    await handleMergeSortInternal(0, n-1);
    for (let i: number = 0; i < n && !stopSort; ++i) {
        numDivs[i].classList.add("sorted-divs");
    }
    endSorting();
}

let generateButton: HTMLButtonElement = document.createElement("button");
generateButton.innerText = "Generate";
generateButton.addEventListener("click", handleGenerate);

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

let sortingAlgo: { name: string, func: (e: MouseEvent) => void }[] = [
    { name: "Bubble Sort", func: handleBubbleSort },
    { name: "Insertion Sort", func: handleInsertionSort },
    { name: "Quick Sort", func: handleQuickSort },
    { name: "Merge Sort", func: handleMergeSort },
];

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
    speed = speedScale - Number(target.value);
    speedLabel.innerHTML = `speed: ${speedScale - speed}`;
}

let scaleLabel: HTMLSpanElement = document.createElement("span");
scaleLabel.innerHTML = `max lines: ${scale}`;

let scaleSlider: HTMLInputElement = document.createElement("input");
scaleSlider.classList.add("slider");
scaleSlider.type = "range";
scaleSlider.max = "100";
scaleSlider.min = "10";
scaleSlider.value = `${scale}`;
scaleSlider.oninput = handleScaleSliderChange;

let speedLabel: HTMLSpanElement = document.createElement("span");
speedLabel.innerHTML = `speed: ${speedScale - speed}`;

let speedSlider: HTMLInputElement = document.createElement("input");
speedSlider.classList.add("slider");
speedSlider.type = "range";
speedSlider.max = `${speedScale}`;
speedSlider.min = "0";
speedSlider.value = `${speedScale - speed}`;
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

