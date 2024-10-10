/* eslint-disable @typescript-eslint/no-unused-vars */
export async function copyToClipboard(
    element: EventTarget | Element | string | null,
    showToast?: ShowToast
) {
    const text = typeof element === 'string' ? element :
        element instanceof Element ? element.textContent :
        undefined;

    if (text === undefined) {
        showToast?.({ error: 'Unable to copy from element' });
        return;
    }

    if (!text) {
        showToast?.({ error: 'No text to copy' });
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        showToast?.({ message: 'Copied to clipboard' });
    } catch (_) {
        showToast?.({ error: 'Failed to copy to clipboard' });
    }
}
