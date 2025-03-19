chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "hideElements") {
        chrome.storage.local.set({ selectors: request.selectors }, () => {
            applySelectors(sender.tab.id, request.selectors);
        });
    }
});
  
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url.includes("www.ebay.com")) {
        chrome.storage.local.get("selectors", (data) => {
            if (data.selectors) {
                applySelectors(tabId, data.selectors);
            }
        });
    }
});
  
function applySelectors(tabId, selectors) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: hideElementsWithObserver,
        args: [selectors]
    });
}

function hideElementsWithObserver(selectors) {
    if (!selectors) return;

    function hideMatchingElements() {
        selectors.split(',').forEach(selector => {
            document.querySelectorAll(selector.trim()).forEach(el => {
                el.style.display = "none";
            });
        });
    }

    // Hide elements initially
    hideMatchingElements();

    // Observe changes in the DOM and hide new elements dynamically
    const observer = new MutationObserver(() => {
        hideMatchingElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });
}
