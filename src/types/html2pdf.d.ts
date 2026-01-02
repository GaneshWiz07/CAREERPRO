declare module 'html2pdf.js' {
    interface Html2PdfOptions {
        margin?: number | number[];
        filename?: string;
        image?: { type: string; quality: number };
        html2canvas?: any;
        jsPDF?: any;
        enableLinks?: boolean;
        pagebreak?: any;
    }

    interface Html2PdfWorker {
        from(element: HTMLElement): Html2PdfWorker;
        set(options: Html2PdfOptions): Html2PdfWorker;
        save(): Promise<void>;
        toPdf(): Html2PdfWorker;
        outputPdf(type?: string, options?: any): Promise<any>;
        then(callback: () => void): Html2PdfWorker;
        catch(callback: (error: any) => void): Html2PdfWorker;
    }

    function html2pdf(): Html2PdfWorker;
    export default html2pdf;
}
