type ShowToast = (data: { error?: string; message?: string }) => void;

type Trggr = {
    id: string;
    createdAt: Date | null;
    replacedAt: Date | null;
    deletedAt: Date | null;
    userId: string | null;
    classification: string;
    warning: string;
    description: string;
    content: string;
    type: string;
    replacement: string | null;
    replacementOf: string | null;
}