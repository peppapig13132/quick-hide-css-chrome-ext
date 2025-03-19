document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["domain", "selectors"], (data) => {
        if (data.domain) {
            document.getElementById("domain").value = data.domain;
        }
        if (data.selectors) {
            document.getElementById("selectors").value = data.selectors;
        }
    });
});

document.getElementById("activate").addEventListener("click", () => {
    const domain = document.getElementById("domain").value.trim();
    const selectors = document.getElementById("selectors").value.trim();

    if (!domain || !selectors) {
        alert("Please enter a valid domain and selectors.");
        return;
    }

    chrome.storage.local.set({ domain, selectors });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].url.includes(domain)) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: hideElements,
                args: [selectors]
            });
        }
    });
});

document.getElementById("deactivate").addEventListener("click", () => {
    chrome.storage.local.remove(["domain", "selectors"]);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
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
    selectors.split(",").forEach(selector => {
        document.querySelectorAll(selector.trim()).forEach(el => {
            el.style.display = "none";
        });
    });
}

function showElements() {
    document.querySelectorAll('[style*="display: none"]').forEach(el => {
        el.style.display = "";
    });
}
