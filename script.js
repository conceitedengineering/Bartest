// Cursor Selector Configuration
const cursorSelector = document.getElementById("cursorSelector");
const cursorOptionsContainer = document.getElementById("cursorOptions");

// Available cursors - ADD YOUR CURSOR ASSETS HERE
// Place cursor images in: assets/cursors/
// Update the paths below to match your cursor filenames
const availableCursors = [
    { id: "default", name: "Default", image: null }, // null means use default cursor
    { id: "cursor1", name: "Cursor 1", image: "assets/cursors/Wine_Glass.png" },
    { id: "cursor2", name: "Cursor 2", image: "assets/cursors/Berg_Cap.png" },
    { id: "cursor3", name: "Cursor 3", image: "assets/cursors/cursor3.png" },
    // Add more cursors as needed - just add more objects to this array
];

// Initialize cursor selector UI
function initializeCursorSelector() {
    cursorOptionsContainer.innerHTML = "";
    
    availableCursors.forEach(cursor => {
        const option = document.createElement("div");
        option.className = "cursor-option";
        option.dataset.cursorId = cursor.id;
        
        if (cursor.image) {
            const img = document.createElement("img");
            img.src = cursor.image;
            img.alt = cursor.name;
            img.onerror = () => {
                // Hide image if asset not found
                img.style.display = "none";
            };
            option.appendChild(img);
        }
        
        const label = document.createElement("span");
        label.textContent = cursor.name;
        option.appendChild(label);
        
        option.addEventListener("click", () => {
            selectCursor(cursor.id);
        });
        
        cursorOptionsContainer.appendChild(option);
    });
    
    // Load saved cursor preference
    const savedCursor = localStorage.getItem("selectedCursor") || "default";
    selectCursor(savedCursor, false);
}

// Select and apply cursor
function selectCursor(cursorId, save = true) {
    if (save) {
        localStorage.setItem("selectedCursor", cursorId);
    }
    
    // Update UI
    document.querySelectorAll(".cursor-option").forEach(opt => {
        opt.classList.remove("selected");
        if (opt.dataset.cursorId === cursorId) {
            opt.classList.add("selected");
        }
    });
    
    // Apply cursor to document and all elements
    const cursor = availableCursors.find(c => c.id === cursorId);
    let cursorStyle = "default";
    
    if (cursor && cursor.image) {
        // Custom cursors need hotspot coordinates (x y) - using 0 0 for top-left
        // You can adjust these if your cursor images have a different hotspot
        // URL encode the path to handle spaces and special characters
        const imageUrl = encodeURI(cursor.image);
        cursorStyle = `url("${imageUrl}") 0 0, auto`;
    }
    
    // Apply to body directly first
    document.body.style.cursor = cursorStyle;
    
    // Remove existing cursor style if it exists
    const existingStyle = document.getElementById("custom-cursor-style");
    if (existingStyle) {
        existingStyle.remove();
    }
    
    // Create a style element to apply cursor to all elements
    // Use CSS.escape for the URL part, or construct the CSS string carefully
    const style = document.createElement("style");
    style.id = "custom-cursor-style";
    // Build the CSS rule with proper escaping
    const cssRule = cursor && cursor.image 
        ? `url("${encodeURI(cursor.image)}") 0 0, auto`
        : "default";
    style.textContent = `* { cursor: ${cssRule} !important; } .cursor-option { cursor: pointer !important; }`;
    document.head.appendChild(style);
    
    // Update awareness (optional - to show others which cursor you selected)
    if (window.myAwareness) {
        window.myAwareness.selectedCursor = cursorId;
    }
    
    console.log("Cursor changed to:", cursorId, "Style:", cursorStyle); // Debug log
}

// Cigarette Element Configuration
const cigaretteElement = document.getElementById("cigarette");

// Configure cigarette BEFORE importing playhtml
// Position it in the center of the bar area (bar starts around x=634 in the SVG)
// We'll position it relative to viewport center, accounting for the bar's position
cigaretteElement.defaultData = {
    x: window.innerWidth * 0.6, // Position in the bar area (right side of screen)
    y: window.innerHeight / 2 - 100,
    isLit: false
};

cigaretteElement.onClick = (e, { data, setData }) => {
    // Toggle lit state
    setData({ isLit: !data.isLit });
};

cigaretteElement.onDrag = (e, { data, setData }) => {
    // Update position while dragging
    const rect = cigaretteElement.getBoundingClientRect();
    const newX = e.clientX - rect.width / 2;
    const newY = e.clientY - rect.height / 2;
    
    // Keep within bounds
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;
    
    setData({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
    });
};

cigaretteElement.updateElement = ({ element, data }) => {
    // Update position
    element.style.left = `${data.x}px`;
    element.style.top = `${data.y}px`;
    
    // Update visual state
    let visual = element.querySelector(".cigarette-visual");
    if (!visual) {
        // Create visual element if it doesn't exist
        visual = document.createElement("div");
        visual.className = "cigarette-visual";
        element.appendChild(visual);
        
        // Add smoke effect
        const smoke = document.createElement("div");
        smoke.className = "smoke";
        visual.appendChild(smoke);
    }
    
    // Update based on lit state
    if (data.isLit) {
        visual.className = "cigarette-visual cigarette-lit";
        // TODO: When you add your cigarette assets, uncomment and update the path:
        // visual.style.backgroundImage = "url('assets/cigarette-lit.png')";
        // visual.style.backgroundSize = "contain";
    } else {
        visual.className = "cigarette-visual cigarette-unlit";
        // TODO: When you add your cigarette assets, uncomment and update the path:
        // visual.style.backgroundImage = "url('assets/cigarette-unlit.png')";
        // visual.style.backgroundSize = "contain";
    }
};

cigaretteElement.onMount = ({ getData, setData, element }) => {
    // Initial setup
    const data = getData();
    cigaretteElement.updateElement({ element, data });
};

// Cursor Selector Element Configuration (using can-play for awareness)
const cursorSelectorElement = document.getElementById("cursorSelector");

cursorSelectorElement.defaultData = {
    // No persistent data needed - using localStorage for per-user selection
};

cursorSelectorElement.myDefaultAwareness = {
    selectedCursor: localStorage.getItem("selectedCursor") || "default"
};

cursorSelectorElement.updateElement = ({ element, data }) => {
    // Update awareness display if needed
    // Could show which cursor each user has selected
};

// Initialize cursor selector UI
initializeCursorSelector();

// Import and initialize playhtml
import { playhtml } from "https://unpkg.com/playhtml@latest";

playhtml.init({
    cursors: {
        enabled: true,
        room: "page"
    }
});

