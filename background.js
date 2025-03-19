chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "hideElements") {
        chrome.storage.local.set({ domain: request.domain, selectors: request.selectors }, () => {
            applySelectors(sender.tab.id, request.selectors);
        });
    }
});
  
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        chrome.storage.local.get(["domain", "selectors"], (data) => {
            if (data.domain && data.selectors && tab.url.includes(data.domain)) {
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

    hideMatchingElements();

    const observer = new MutationObserver(() => {
        hideMatchingElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });
}
