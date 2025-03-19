document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("selectors", (data) => {
        if (data.selectors) {
            document.getElementById("selectors").value = data.selectors;
        }
    });
});
  
document.getElementById("activate").addEventListener("click", () => {
    const selectors = document.getElementById("selectors").value.trim();
    chrome.storage.local.set({ selectors });
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs.length > 0) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: hideElements,
                args: [selectors]
            });
        }
    });
});
    
document.getElementById("deactivate").addEventListener("click", () => {
    chrome.storage.local.remove("selectors");
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs.length > 0) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: showElements
            });
        }
    });
});
  
function hideElements(selectors) {
    if (!selectors) return;

    selectors.split('\n').forEach(selector => {
        document.querySelectorAll(selector.trim()).forEach(el => {
            el.style.display = "none";
        });
    });
}
  
function showElements() {
    const hiddenElements = document.querySelectorAll('[style*="display: none"]');
    
    hiddenElements.forEach(el => {
        el.style.display = "";
    });
}